
import UserModel from "@/models/User";
import myMongooseConnect from "@/lib/dbConnect";
import { sendVerifcaitonEmail } from "@/lib/resend";
import { hash } from 'bcryptjs';
import { UserValidateSchema } from "@/Schemas/signUpSchema";

export async function POST(req: Request) {
    await myMongooseConnect()
    try {
        const { username, email, password } = await req.json()

        const existingVerifiedUserName = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUserName) {
            return Response.json({
                message: "User already exists with this username", success: false,
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(Math.random() * 999999 + 1).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                // existing doing nothing 
                return Response.json({
                    message: "Account is already exist with this email", success: false,
                }, { status: 507 })
            } else {
                // sending verify code again and saving password
                const hashPassword = await hash(password, 10)
                existingUserByEmail.password = hashPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3200000)
                await existingUserByEmail.save()
            }
        } else {
            // Creating new user
            const hashPassword = await hash(password, 10)
            const expiryDate = new Date(Date.now() + 3200000)

            const newUser = new UserModel({
                username,
                email,
                verifyCode,
                password: hashPassword,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                message: []
            })
            newUser.save()
        }

        //  send verifcation email 
        const emailResponse = await sendVerifcaitonEmail(email, verifyCode, username)

        if (!emailResponse.status) {
            return Response.json({
                message: emailResponse.responseMessage, success: false,
            }, { status: 500 })
        } else {
            return Response.json({
                message: "A verifcation OTP has been sent to your email.", success: true,
            }, { status: 200 })
        }

    } catch (err) {
        console.error('Error in sign-up route');
        return Response.json(
            {
                message: 'Unable to register user',
                success: false
            },
            {
                status: 500
            }
        )
    }
}

