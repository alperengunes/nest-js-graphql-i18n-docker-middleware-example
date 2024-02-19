import { HttpStatus } from "@nestjs/common";
import { ResponseJson } from "../types/ResponseJson";

export function responseJson(data: any, message: string[] = null, error: string = "Bad Request", statusCode: HttpStatus = 422): ResponseJson<JSON | string[]> {
    return {
        data: data,
        message: message,
        error: error,
        statusCode: statusCode
    }
}