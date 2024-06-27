import UserModel from "@/models/User";
import * as yup from 'yup'
import mongoConnect from "@/lib/dbConnect";
import { VerifyCodeSchema } from "@/Schemas/verifyschema";

export async function POST(req: Request) {
    await mongoConnect()

    try {

        const { username, verifyCode } = await req.json();
        await VerifyCodeSchema.validate({ code: verifyCode })

        const decodUsername = decodeURIComponent(username)
        const existedUser = await UserModel.findOne({ username: decodUsername })

        if (!existedUser) {

            return Response.json({
                message: 'user not found',
                success: false
            }, { status: 404 })
        }

        const isCodeValid = verifyCode.toString() === existedUser.verifyCode
        const isCodeNotExpire = new Date(existedUser.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpire) {
            await existedUser.updateOne({ isVerified: true })
            return Response.json({
                success: true,
                message: "User is verifid successfully"
            }, { status: 200 })

        } else if (!isCodeValid && !isCodeNotExpire) {
            return Response.json({
                success: false,
                message: "Your code is inncorrect and expired. Please geneerate new one"
            }, { status: 400 })

        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Inccorrect Verify Code"
            }, { status: 400 })

        } else if (!isCodeNotExpire) {
            return Response.json({
                success: false,
                message: "Your code has been expired"
            }, { status: 400 })

        }


    } catch (err: any) {
        return Response.json({
            message: 'Invalid verify code',
            error: err.errors,
            success: false
        }, { status: 400 })
    }


}
