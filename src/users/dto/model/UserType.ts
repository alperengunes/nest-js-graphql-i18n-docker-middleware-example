import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginationResultType } from '../../../lib/model/PaginationResultType';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UserPaginationResultType extends PaginationResultType(UserType) {}