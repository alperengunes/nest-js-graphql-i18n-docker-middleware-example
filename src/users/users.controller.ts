import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    const responseData = await this.usersService.create(createUserDto);
    return response.status(responseData.statusCode).json(responseData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response: Response) {
    const responseData = await this.usersService.update(+id, updateUserDto);
    return response.status(responseData.statusCode).json(responseData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const responseData = await this.usersService.remove(+id);
    return response.status(responseData.statusCode).json(responseData);
  }
}
