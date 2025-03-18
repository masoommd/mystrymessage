import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code, password } = await request.json();
    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodeUsername, resetToken: code });
    if (!user) {
      return Response.json(
        { success: false, message: 'user not found' },
        { status: 500 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user", error);
    return Response.json(
      {
        success: false,
        message: "Error checking user",
      },
      {
        status: 500,
      }
    );
  }
}
