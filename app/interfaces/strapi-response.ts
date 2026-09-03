export interface PaginationMeta {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: PaginationMeta
  }
}

export interface StrapiPaginatedResponse<T> extends StrapiResponse<T> {
  meta: {
    pagination: PaginationMeta
  }
}
