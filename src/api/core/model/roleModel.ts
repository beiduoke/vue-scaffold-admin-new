import { BasicFetchResult, BasicPageParams, State } from '.././model/baseModel';

export enum RoleScope {
  UNSPECIFIED,
  ALL,
  SELF,
  DEPT,
  DEPT_FOLLOW,
  DEPT_CUSTOM,
}

export type RoleParams = {
  name?: string;
  state?: State;
};

export type RolePageParams = BasicPageParams & RoleParams;

export interface RoleListItem {
  id: string;
  name: string;
  state: State;
  sort: string;
  dataScope: RoleScope | string;
  createdAt: string;
}

export type RoleListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleDataScopeModel<T = string | number> = {
  scope: RoleScope | string;
  deptCustoms: T[];
};
