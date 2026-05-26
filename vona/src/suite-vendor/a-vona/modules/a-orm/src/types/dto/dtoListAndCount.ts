export interface TypeDtoListAndCountResult<T> {
  list: T[];
  total: string;
  pageCount: number;
  pageSize: number;
  pageNo: number;
}
