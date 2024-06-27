import mongoose, { Document, mongo } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    message: Message[]
}

const MessageScheme: mongoose.Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserScheme: mongoose.Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/, "Enter valid email address"]
    },
    password: {
        type: String,
        min: 8,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageScheme]
});


const UserModel = mongoose.models.User as mongoose.Model<User> ||
    mongoose.model<User>("User", UserScheme)

// const MessageModel = mongoose.models.Message as mongoose.Model<Message> ||
    // mongoose.model<Message>("Message", MessageScheme)

export default UserModel;