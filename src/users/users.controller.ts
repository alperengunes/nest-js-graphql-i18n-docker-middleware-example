import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { I18nLang } from 'nestjs-i18n';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@I18nLang() lang: string = "en", @Body() createUserDto: CreateUserDto, @Res() response: Response) {
    const responseData = await this.usersService.create(createUserDto, lang);
    return response.status(responseData.statusCode).json(responseData);
  }

  @Patch(':id')
  async update(@I18nLang() lang: string = "en", @Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response: Response) {
    const responseData = await this.usersService.update(+id, updateUserDto, lang);
    return response.status(responseData.statusCode).json(responseData);
  }

  @Delete(':id')
  async remove(@I18nLang() lang: string = "en", @Param('id') id: string, @Res() response: Response) {
    const responseData = await this.usersService.remove(+id, lang);
    return response.status(responseData.statusCode).json(responseData);
  }
}
