import {z} from "zod"

export const resetPasswordSchema = z.object({
    password:z.string().min(6,{message:"Password must be atleast 6 characters"}),
    confirmPassword:z.string().min(6,{message:"Password must be atleast 6 characters"}),
    // code:z.string().min(1, {message:"Token is required"})
}).refine((data)=>data.password === data.confirmPassword, {
    message:"Passwords do not match",
    path:["confirmPassword"]
})