
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoConnect from "@/lib/dbConnect";


export async function POST(req: Request) {
    await mongoConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !user) {
        return Response.json({
            message: "No authorized",
            success: false
        }, { status: 401 })
    }

    const userId = user._id
    const { acceptingMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptingMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user accepting message"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User successfully updated accepting message"
        }, { status: 200 })

    } catch (err) {
        return Response.json({
            message: "Error updating user accepting messages",
            success: false
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    await mongoConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !user) {
        return Response.json({
            message: "No authorized",
            success: false
        }, { status: 401 })
    }

    const userId = user._id
    try {
        const existingUser = await UserModel.findById(userId)

        if (!existingUser) {
            return Response.json({
                message: 'user not found',
                success: false
            }, { status: 404 })
        }

        return Response.json({
            isAccpetingMessages: existingUser.isAcceptingMessage,
            success: true
        }, { status: 200 })

    } catch (err) {
        return Response.json({
            message: "Error fetching user accepting message status",
            success: false
        }, { status: 500 })
    }
}

