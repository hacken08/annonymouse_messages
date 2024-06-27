import mongoConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { MessageSchema } from "@/Schemas/messageSchema";

export async function POST(req: Request) {
    await mongoConnect()

    const { content, username } = await req.json()
    const newMessages = await MessageSchema.validate({ content })

    try {
        const existedUser = await UserModel.findOne({ username })

        if (!existedUser) {
            return Response.json({
                message: 'user not found',
                success: false
            }, { status: 404 })
        }

        if (!existedUser.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'User is not accepting messages',
            }, { status: 403 })
        }

        // const newMessage = { content, createdAt: new Date() }
        existedUser.message.push(newMessages as Message)
        await existedUser.save()

        return Response.json({
            message: 'Message sent successfully',
            success: true
        }, { status: 201 })

    } catch (err: any) {

        return Response.json({
            message: 'Error sending messages',
            error: err.errors,
            success: false
        }, { status: 500 })

    }

}