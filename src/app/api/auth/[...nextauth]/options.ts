import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/models/user.model";
import { connectToDb } from "@/lib/connectDb";
import bcrypt from 'bcryptjs'


export const authOptions: NextAuthOptions = {
    // Can Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                await connectToDb()
                try {
                    // Check if credentials are defined
                    if (!credentials || !credentials.email || !credentials.password) {
                        throw new Error("Email and password are required"); 
                    }


                    // Find user in database
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            // {username : credentials?.username }
                        ]
                    })

                    if (!user) {
                        
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not verified")
                    }
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password)
                    if (isValidPassword) {
                        return user
                    } else {
                        throw new Error("Invalid password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Persist the user ID in the token
            token._id = user._id?.toString(); // Convert ObjectId to string
            token.username = user.username,
                token.isAcceptingMessage = user.isAcceptingMessage,
                token.isVerified = user.isVerified


            return token

        },
        async session({ session, token }) {
            // Store the user details in the session
            session.user._id = token._id
            session.user.username = token.username
            session.user.isAcceptingMessage = token.isAcceptingMessage
            session.user.isVerified = token.isVerified


            return session


        }


    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}
