import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request){
    await dbConnect();

    
    try {
        const {username, content} = await request.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        //check user accepting messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }

        const newMessages = {content, createdAt:new Date()}
        user.messages.push(newMessages as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })


    } catch (error) {
        console.log("Error adding message: ",error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}