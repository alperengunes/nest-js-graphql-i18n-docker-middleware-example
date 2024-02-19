import { Module, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './resolvers/user.resolvers';
import { UsersGraphqlService } from './users-graphql.service';
import { ResponseJsonUtils } from '../lib/utils/response-json';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, UsersGraphqlService, ResponseJsonUtils],
})
export class UsersModule { }
