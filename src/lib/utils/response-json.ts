import { HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ResponseJson } from '../types/ResponseJson';

@Injectable()
export class ResponseJsonUtils {
    constructor(private readonly i18n: I18nService) { }


    public async response(data: any, message: string[] = null, error: string = "Bad Request", statusCode: HttpStatus = 422, lang: string = "en"): Promise<ResponseJson<JSON | string[]>> {
        if (message) {
            message.forEach(async (msg, index) => {
                const messageContext = await this.i18n.translate(msg, { lang });
                if (messageContext) {
                    message[index] = messageContext as string;
                }
            });
        }

        return {
            data: data,
            message: message,
            error: this.i18n.translate(error, { lang }),
            statusCode: statusCode
        }
    }
}