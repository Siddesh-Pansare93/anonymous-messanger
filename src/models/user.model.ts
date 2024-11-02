import mongoose, { Schema, Document } from 'mongoose'

export interface Message extends Document {
    content: string,
    createdAt: Date
}


const messsageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})



export interface User extends Document {
    username: string;
    email: string;
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified : boolean , 
    isAcceptingMessage: boolean,
    messages: Message[]
}


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true , "username is Required "],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/  , "Please enter valid email"   ]
    },
    password: {
        type: String,
        required: [true , "password is Required "],
    },
    verifyCode: {
        type: String,
        required: [true , "verifyCode is Required "],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true , "VerifyCodeExpiry is Required "],
        
    },
    isVerified: {
        type: Boolean,
        default : false , 
        required : [true  , "isVerified is required"]
    },
    isAcceptingMessage: {
        type: Boolean,
        required: [true , "isAcceptingMessage is Required "],
        default: false,
    },
    messages: {
        type: [messsageSchema],
        required: false,
    }

})

//Todo --- underStand the typeScript Syntax of Mongoose 
const userModel  = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , userSchema))

