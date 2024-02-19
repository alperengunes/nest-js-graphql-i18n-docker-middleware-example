import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseJsonUtils } from '../lib/utils/response-json';
import * as bcrypt from 'bcrypt';
import { ResponseJson } from 'src/lib/types/ResponseJson';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly responseJsonUtils: ResponseJsonUtils,
  ) { }


  private emailExistsMessageKey = 'validation.users.EmailExists'
  private badRequestMessageKey = 'validation.users.BadRequest'
  private noRecordMessageKey = 'validation.users.NoRecord'
  private createdMessageKey = 'validation.users.Created'
  private okMessageKey = 'validation.users.OK'
  private userNotFoundMessageKey = 'validation.users.UserNotFound'
  private userDeletedMessageKey = 'validation.users.UserDeleted'
  private userUpdatedMessageKey = 'validation.users.UserUpdated'

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto, lang: string): Promise<ResponseJson<User | string[]>> {
    const findOneByEmail = await this.findOneByEmail(createUserDto.email);
    if (findOneByEmail) {
      return this.responseJsonUtils.response(null, [this.emailExistsMessageKey], this.badRequestMessageKey, 422, lang);
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    const userData = this.usersRepository.create(createUserDto);
    const user = await this.usersRepository.save(userData);
    return this.responseJsonUtils.response(user, [this.createdMessageKey], this.createdMessageKey, 200, lang);
  }

  async update(id: number, updateUserDto: UpdateUserDto, lang: string): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const emailExists = await this.findOneByEmail(updateUserDto.email);
    if (!user) {
      return this.responseJsonUtils.response(null, [this.userNotFoundMessageKey], this.noRecordMessageKey, 404, lang);
    }
    if (emailExists && emailExists.id != id) {
      // console.log(emailExists);
      return this.responseJsonUtils.response(null, [this.emailExistsMessageKey], this.badRequestMessageKey, 422, lang);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    await this.usersRepository.update(id, updateUserDto);
    const userData = await this.usersRepository.findOne({ where: { id } });
    return this.responseJsonUtils.response(userData, [this.userUpdatedMessageKey], this.okMessageKey, 200, lang);
  }

  async remove(id: number, lang: string): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return this.responseJsonUtils.response(null, [this.userNotFoundMessageKey], this.noRecordMessageKey, 404, lang);
    }
    await this.usersRepository.delete(id);
    return this.responseJsonUtils.response(user, [this.userDeletedMessageKey], this.okMessageKey, 200, lang);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
