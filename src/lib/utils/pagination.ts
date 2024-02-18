import { Repository } from 'typeorm';

export async function getPagination<T>(repository: Repository<T>, page: number, limit: number) {
  const take = limit;
  const skip = (page - 1) * limit;

  const [results, total] = await repository.findAndCount({
    take,
    skip,
  });

  return {
    results,
    total,
    page,
    limit,
    pageTotal: Math.ceil(total / limit),
  };
}