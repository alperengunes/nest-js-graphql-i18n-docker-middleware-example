import { HttpStatus } from "@nestjs/common";

export type ResponseJson<T> = {
    data: any,
    message: string[] | null,
    error: string,
    statusCode: HttpStatus
};