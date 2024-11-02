import { z } from 'zod'


export const messageSchema = z.object({
    content : z
    .string()
    .min(2 ,  {message : "message content should be atleast 2 characters Long"})
    .max(300 , {message : "message content should be atmost 1000"})
})