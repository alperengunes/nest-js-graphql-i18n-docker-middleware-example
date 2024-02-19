import { Args, Query, Resolver, Int } from '@nestjs/graphql';
import { UserPaginationResultType, UserType } from '../dto/model/UserType';
import { UsersGraphqlService } from '../users-graphql.service';

@Resolver(() => UserType)
export class UsersResolver {
    constructor(private readonly usersGraphqlService: UsersGraphqlService) { }

    @Query(() => UserPaginationResultType)
    async users(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    ) {
        return this.usersGraphqlService.findAll(page, limit);
    }

    @Query(() => [UserType])
    async user(
        @Args('id', { type: () => Int, defaultValue: 0 }) id: number,
    ): Promise<UserType[]> {
        return this.usersGraphqlService.find(id);
    }
}