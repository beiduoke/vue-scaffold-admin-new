import { BasicFetchResult, BasicPageParams } from '.././model/baseModel';

export enum RoleState {
  UNSPECIFIED = 'ROLE_STATE_UNSPECIFIED',
  ACTIVE = 'ROLE_STATE_ACTIVE',
  INACTIVE = 'ROLE_STATE_INACTIVE',
  BANNED = 'ROLE_STATE_BANNED',
}

export enum RoleScope {
  UNSPECIFIED = 'ROLE_SCOPE_UNSPECIFIED',
  ALL = 'ROLE_DATA_SCOPE_ALL',
  SELF = 'ROLE_DATA_SCOPE_SELF',
  DEPT = 'ROLE_DATA_SCOPE_DEPT',
  DEPT_FOLLOW = 'ROLE_DATA_SCOPE_DEPT_FOLLOW',
  DEPT_CUSTOM = 'ROLE_DATA_SCOPE_DEPT_CUSTOM',
}

export type RoleParams = {
  name?: string;
  state?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export interface RoleListItem {
  id: string;
  name: string;
  state: RoleState;
  sort: string;
  dataScope: RoleScope | string;
  createdAt: string;
}

export type RoleListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleDataScopeModel<T = string | number> = {
  scope: RoleScope | string;
  deptCustoms: T[];
};
