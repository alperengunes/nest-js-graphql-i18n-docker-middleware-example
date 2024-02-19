import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseJson } from '../lib/utils/response-json';
import { PaginationResult } from '../lib/types/PaginationResult';
import { getPagination } from '../lib/utils/pagination';
import * as bcrypt from 'bcrypt';
import { ResponseJson } from 'src/lib/types/ResponseJson';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseJson<User | string[]>> {
    const findOneByEmail = await this.findOneByEmail(createUserDto.email);
    if (findOneByEmail) {
      return responseJson(null, ['Email already exists.'], 'Bad Request', 422);
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    const userData = this.usersRepository.create(createUserDto);
    const user = await this.usersRepository.save(userData);
    return responseJson(user, ['User created successfully.'], 'Created', 200);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<User>> {
    return getPagination(this.usersRepository, page, limit);
  }

  async findOne(id: number): Promise<User | any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return responseJson(null, ['User not found.'], 'No Record', 404);
    }
    return responseJson(user, ['User found.'], 'OK', 200);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const emailExists = await this.findOneByEmail(updateUserDto.email);
    if (!user) {
      return responseJson(null, ['User not found.'], 'No Record', 404);
    }
    if (emailExists && emailExists.id != id) {
      // console.log(emailExists);
      return responseJson(null, ['Email already exists.'], 'Bad Request', 422);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    await this.usersRepository.update(id, updateUserDto);
    const userData = await this.usersRepository.findOne({ where: { id } });
    return responseJson(userData, ['User updated successfully.'], 'OK', 200);
  }

  async remove(id: number): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return responseJson(null, ['User not found.'], 'No Record', 404);
    }
    await this.usersRepository.delete(id);
    return responseJson(user, ['User deleted successfully.'], 'OK', 200);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
