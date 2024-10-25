export declare type Paged<T, U = undefined> = {
    values: T[];
    page: number;
    pageSize: number;
    totalResults: number;
    hasMorePages: boolean;
} & (U extends undefined
    ? {} // eslint-disable-line
    : {
          facets: U;
      });
