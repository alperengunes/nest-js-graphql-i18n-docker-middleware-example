import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getPagination } from 'src/lib/utils/pagination';
import { PaginationResult } from 'src/lib/types/PaginationResult';

@Injectable()
export class UsersGraphqlService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(page: number, limit: number): Promise<PaginationResult<User>> {
    return getPagination(this.usersRepository, page, limit);
  }

  find(id: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { id },
    });
  }
}