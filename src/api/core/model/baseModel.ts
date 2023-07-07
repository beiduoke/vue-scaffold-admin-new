import { Result } from '/#/axios';

export enum Enable {
  UNSPECIFIED,
  YES,
  NO,
}

export enum Sort {
  DESC,
  ASC,
}

export enum State {
  UNSPECIFIED,
  ACTIVE,
  INACTIVE,
  BANNED,
}

export enum Switch {
  UNSPECIFIED,
  OPEN,
  CLOSE,
}

export interface BasicPageParams {
  page?: number; // 页码
  pageSize?: number; // 每页数量
  query?: { [key: string]: string }; // 查询条件
  orderBy?: { [key: string]: string }; // 排序
  nopaging?: boolean; // 不分页
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface BasicDataResult {
  id: number;
}

export interface BasicHandleResult<T = any> extends Result<T> {}
