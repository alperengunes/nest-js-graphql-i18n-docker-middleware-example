import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateMessage } from '../lib/utils/validation-mesage';
import { PaginationResult } from '../lib/types/PaginationResult';
import { getPagination } from '../lib/utils/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User | any>{
    const findOneByEmail = await this.findOneByEmail(createUserDto.email);
    if (findOneByEmail) {
      return validateMessage(['Email already exists.']);
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<User>> {
    return getPagination(this.usersRepository, page, limit);
  }

  async findOne(id: number): Promise<User | any>{
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return validateMessage(['User not found.'], 'No Record', 404);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | any>{
    const user = await this.usersRepository.findOne({ where: { id } });
    const emailExists = await this.findOneByEmail(updateUserDto.email);
    if (!user) {
      return validateMessage(['User not found.'], 'No Record', 404);
    }
    if(emailExists && emailExists.id != id){
      // console.log(emailExists);
      return validateMessage(['Email already exists.']);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<User | any>{
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return validateMessage(['User not found.'], 'No Record', 404);
    }
    await this.usersRepository.delete(id);
    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
