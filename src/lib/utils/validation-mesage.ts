import { HttpCode } from "@nestjs/common";

export function validateMessage(messages: string[] = [], error: string = "Bad Request", statusCode: number = 422): Object {
    return {
        message: messages,
        error: error,
        statusCode: statusCode
    }
}