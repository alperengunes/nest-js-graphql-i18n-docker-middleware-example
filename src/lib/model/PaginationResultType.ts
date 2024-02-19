import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { ClassType } from 'type-graphql'; 

export function PaginationResultType<TItem extends object>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResultClass {
    @Field(() => [TItemClass])
    results: TItem[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    pageTotal: number;
  }

  return PaginationResultClass;
}