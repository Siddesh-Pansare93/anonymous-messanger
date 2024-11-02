import { connectToDb } from "@/lib/connectDb";
import { sendVerificationEmail } from "@/lib/resend";
import userModel from "@/models/user.model";
import bcrypt from 'bcryptjs'

async function POST(request: Request,) {
    const db = await connectToDb()

    try {

        const { username, email, password } = await request.json()

        //find if the user with the same userName exists and also checks that is it is verified  
        const existingUserByUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User with username already Exists"
                },
                {
                    status: 400
                }
            )
        }


        //FInding User with Email 

        const existingUserByEmail = await userModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                // User Exists/registered and he is also verified 
                return Response.json(
                    {
                        success: false,
                        message: "User with email already exists and it is verified"
                    },
                    {
                        status: 400
                    })
            } else {
                // User is registerd But not Verified 

                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            // User is not registered
            //User Doesn't exists in the database -- so create user

            const verifyCodeExpiry = new Date(Date.now() + 3600000)
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                isAcceptingMessage: true,
                verifyCodeExpiry,
                messages: []
            })

            await newUser.save()
        }

        // If everything is Ok Then Sends Otp/VerifyCode to email for verification 

        const emailResponse = await sendVerificationEmail(username, email, verifyCode)

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email"
                },
                {
                    status: 500
                })
        }

        //FINAL response if everything Works Out 

        return Response.json(
            {
                success: true,
                message: "User registered successfully | Please verify Your Account "
            },
            {
                status: 201

            })


    } catch (error) {
        console.error("ERROR : ", error)
        Response.json(
            {
                error: "Error while regestering User",
                success: false
            }, {
            status: 500
        }
        )
    }
}