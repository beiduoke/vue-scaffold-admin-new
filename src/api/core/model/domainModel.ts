import { BasicFetchResult, BasicPageParams, State } from './baseModel';

export interface DomainParams extends BasicPageParams {
  name?: string;
  state?: State;
}

export interface DomainListItem {
  id: string;
  name: string;
  code: string;
  sort: string;
  parentId: string;
  createdAt: string;
  remark: string;
  state: State;
  // children: DomainListItem[];
}

export type DomainListGetResultModel = BasicFetchResult<DomainListItem>;

export interface PackageParams extends BasicPageParams {
  name?: string;
  state?: State;
}

export interface PackageListItem {
  id: string;
  name: string;
  sort: string;
  createdAt: string;
  state: State;
  remark: string;
  menu_ids: string[];
}

export type PackageListGetResultModel = BasicFetchResult<PackageListItem>;
