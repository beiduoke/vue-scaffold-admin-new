import { BasicFetchResult, State } from './baseModel';

export type DomainParams = {
  name?: string;
  state?: State;
};

export interface DomainListItem {
  id: string;
  name: string;
  code: string;
  sort: string;
  parentId: string;
  createdAt: string;
  remark: string;
  state: State;
  children: DomainListItem[];
}

export type DomainListGetResultModel = BasicFetchResult<DomainListItem>;

export type PackageParams = {
  name?: string;
  state?: State;
};

export interface PackageListItem {
  id: string;
  name: string;
  code: string;
  sort: string;
  parentId: string;
  createdAt: string;
  remark: string;
  state: State;
  children: PackageListItem[];
}

export type PackageListGetResultModel = BasicFetchResult<PackageListItem>;
