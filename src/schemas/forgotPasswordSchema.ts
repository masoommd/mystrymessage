import {z} from "zod"

export const forgotPasswordSchema = z.object({
    input:z.string(),
}) 