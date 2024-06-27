import { Message } from "@/models/User"

export interface ApiResponse {
    status: boolean,
    responseMessage: string,
    data?: any,
    userMessages?: Message[]
}

    