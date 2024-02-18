export type PaginationResult<T> = {
    results: T[];
    total: number;
    page: number;
    limit: number;
    pageTotal: number;
};