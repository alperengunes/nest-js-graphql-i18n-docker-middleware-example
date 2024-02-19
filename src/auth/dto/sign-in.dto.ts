import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string;
}