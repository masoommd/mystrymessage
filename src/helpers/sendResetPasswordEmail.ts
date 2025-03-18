import {resend} from "@/lib/resend"
import resetPasswordEmail from "../../emails/resetPasswordEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendResetPasswordEmail(
    email:string,
    username:string,
    resetToken:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:'Mystery Message | Reset Password code',
            react: resetPasswordEmail({username, resetToken})
        })
        return {success:true, message:"Reset Password  email sent successfully"}
    } catch (emailError) {
        console.log("Error sending reset password code", emailError);
        return {success:false, message:"Failed to send reset password code"}
    }
}