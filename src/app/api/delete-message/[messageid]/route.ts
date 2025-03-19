import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect  from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";


export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !user) {
        return new Response(
            JSON.stringify({
            success: false,
            message: "Not Authenticated"
        }), { status: 401 })
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull : {messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount == 0){
            return new Response(
                JSON.stringify({
                success: false,
                message: "Message not found or already deleted"
            }), { status: 404 })
        }
        return new Response(
            JSON.stringify({
            success: true,
            message: "Message Deleted"
        }), { status: 202 })
    } catch (error) {
        console.log("Error in deleting message: ", error);
        return new Response(
            JSON.stringify({
            success: false,
            message: "Error in deleting message!"
        }), { status: 500 })
    }
}