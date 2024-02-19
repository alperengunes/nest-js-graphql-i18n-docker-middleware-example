import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseJsonUtils } from '../lib/utils/response-json';
import { ResponseJson } from 'src/lib/types/ResponseJson';
import { InjectRepository } from '@nestjs/typeorm';
import { messageKeys } from './message/message-key';
import { generalKeys } from 'src/lib/message/general-key';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly responseJsonUtils: ResponseJsonUtils,
  ) { }

  async create(createUserDto: CreateUserDto, lang: string): Promise<ResponseJson<User | string[]>> {
    const findOneByEmail = await this.findOneByEmail(createUserDto.email);
    if (findOneByEmail) {
      return this.responseJsonUtils.response(null, [messageKeys.emailExists], generalKeys.badRequest, 422, lang);
    }
    const userData = this.usersRepository.create(createUserDto);
    const user = await this.usersRepository.save(userData);
    return this.responseJsonUtils.response(user, [messageKeys.created], generalKeys.success, 200, lang);
  }

  async update(id: number, updateUserDto: UpdateUserDto, lang: string): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const emailExists = await this.findOneByEmail(updateUserDto.email);
    if (!user) {
      return this.responseJsonUtils.response(null, [messageKeys.userNotFound], messageKeys.noRecord, 404, lang);
    }
    if (emailExists && emailExists.id != id) {
      return this.responseJsonUtils.response(null, [messageKeys.emailExists], generalKeys.badRequest, 422, lang);
    }
    await this.usersRepository.update(id, updateUserDto);
    const userData = await this.usersRepository.findOne({ where: { id } });
    return this.responseJsonUtils.response(userData, [messageKeys.userUpdated], generalKeys.success, 200, lang);
  }

  async remove(id: number, lang: string): Promise<ResponseJson<User | string[]>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return this.responseJsonUtils.response(null, [messageKeys.userNotFound], generalKeys.noRecord, 404, lang);
    }
    await this.usersRepository.delete(id);
    return this.responseJsonUtils.response(user, [messageKeys.userDeleted], generalKeys.success, 200, lang);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
