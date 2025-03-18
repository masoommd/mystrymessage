import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendResetPasswordEmail, } from "@/helpers/sendResetPasswordEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { input } = await request.json();

        const existingUser = await UserModel.findOne({
            $or: [
                { email: input },
                { username: input }
            ]
        })

        if (!existingUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 })
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date(); // it give object
        expiryDate.setHours(expiryDate.getHours() + 1);

        existingUser.resetToken = resetToken
        existingUser.resetTokenExpiry = expiryDate
        await existingUser.save();

        //send verification email
        const email = existingUser.email
        const username = existingUser.username
        const emailResponse = await sendResetPasswordEmail(email, username, resetToken);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            username: existingUser.username,
            message: "Reset password email send successfully"
        }, { status: 201 })

    } catch (error) {
        console.log("Error checking user ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking user"
            },
            {
                status: 500
            }
        )
    }
}

