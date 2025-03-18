import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeUsername });
        if (!user) {
            return Response.json(
                { success: false, message: 'user not found' },
                { status: 500 })
        }

        const isCodeValid = user.resetToken === code
        const isCodeNotExpired = new Date(user.resetTokenExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            return Response.json(
                { success: true, message: 'otp verified successfully' },
                { status: 200 })

        } else if (!isCodeNotExpired) {
            return Response.json(
                { success: false, message: 'Verification code has expired, please request for reset password again' },
                { status: 400 })
        } else {
            return Response.json(
                { success: false, message: 'Invalid reset-token code' },
                { status: 400 })

        }
    } catch (error) {
        console.error('Error verifying reset-token:', error);
        return Response.json(
            { success: false, message: 'Error verifying reset-token' },
            { status: 500 })
    }
}
