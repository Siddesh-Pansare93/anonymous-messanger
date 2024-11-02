import { ApiResponse } from '@/types/ApiResponse';
import { Resend } from 'resend';
import VerificationEmail from '../../emailTemplates/verificationEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);



export const sendVerificationEmail = async (
    username : string , 
    email  : string ,
    verifyCode : string
) : Promise<ApiResponse>=>{
    try {
        await resend.emails.send({
            from: 'dev@hiteshchoudhary.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
          return { status : 200 , success: true, message: 'Verification email sent successfully.' };        
    } catch (error) {
        console.log("Failed to Send verification Email " , error)
        return { status :400 ,   success : false , message: "Failed to Send verification Email", }
    }
}


