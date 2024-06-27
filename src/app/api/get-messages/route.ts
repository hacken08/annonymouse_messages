import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoConnect from "@/lib/dbConnect";
import mongoose from "mongoose";


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

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "message.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    message: { $push: "$message" }
                }
            }
        ]);

        if (!user || user.length === 0) {
            return Response.json({
                message: "Messages with this user not found",
                success: false
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            userMessages: user[0].messages,
        }, { status: 200 })

    } catch (error) {

    }


}
