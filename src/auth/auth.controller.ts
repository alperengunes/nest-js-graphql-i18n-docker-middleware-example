import { Controller, Post, Body } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
    constructor(private readonly i18n: I18nService) { }

    @Post('login')
    async login(@I18nLang() lang: string = "en", @Body() signInDto: SignInDto) {
        return this.i18n.t('login.loginMessage', { lang });
    }
}
