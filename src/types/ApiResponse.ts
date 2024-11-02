import { Message } from "@/models/user.model"


export interface ApiResponse { 
    status : number , 
    success : boolean , 
    message : string  , 
    isAcceptingMessage? : boolean , 
    messages? : Array<Message>
}