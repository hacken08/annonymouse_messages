import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import encrypt, { hash } from "bcryptjs";
import UserModel from "@/models/User";
import mongoConnect from "@/lib/dbConnect";


export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            id: "github",
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any): Promise<any> {
                await mongoConnect()
                try {
                    const userExist = await UserModel.findOne({
                        $or: [
                            { email: credentials.username },
                            { username: credentials.username },
                        ]
                    })

                    if (!userExist) {
                        throw new Error("No user found with this username or email address")
                    }

                    if (!userExist.isVerified) {
                        throw new Error("User is not verified yet. please verify yourself")
                    }

                    const isCorrectPassword = await encrypt.compare(`${credentials.password}`, userExist.password)

                    if (!isCorrectPassword) {
                        throw new Error("Password is not correct")
                    } else {
                        return userExist
                    }

                } catch (err) {
                    console.error("Error while Signing In", err)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessage,
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id,
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)

