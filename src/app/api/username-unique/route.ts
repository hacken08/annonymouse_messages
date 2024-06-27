import * as yup from 'yup';
import UserModel from '@/models/User';
import { UserValidateSchema } from "@/Schemas/signUpSchema"
import mongoConnect from '@/lib/dbConnect';

const UsernameQuerySchema = yup.object({
    username: UserValidateSchema,

})

export async function GET(req: Request) {
    await mongoConnect()

    try {

        const { searchParams } = new URL(req.url)
        const queryParams = {
            username: searchParams.get('username')
        }

        await UsernameQuerySchema.validate(queryParams)
        const userExistWithUsernmae = await UserModel.findOne({ username: queryParams.username, isVerified: true })

        if (userExistWithUsernmae) {
            return Response.json({
                message: "Username already taken", success: false,
            }, { status: 400 })
        }

        return Response.json({
            message: "Username is available", success: true,
        }, { status: 200 })

    } catch (err: any) {
        return Response.json({
            message: "Error checking username",
            validation: {
                value: err.value.username,
                error: err.errors,
            },
            success: false
        }, { status: 400 })
    }
}

