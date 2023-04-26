import { BasicFetchResult, BasicPageParams } from '.././model/baseModel';

export enum DeptState {
  UNSPECIFIED = 'DEPT_STATE_UNSPECIFIED',
  ACTIVE = 'DEPT_STATE_ACTIVE',
  INACTIVE = 'DEPT_STATE_INACTIVE',
  BANNED = 'DEPT_STATE_BANNED',
}

export type DeptParams = {
  name?: string;
  state?: string;
};

export type DeptPageParams = BasicPageParams & DeptParams;

export interface DeptListItem {
  id: string;
  name: string;
  roleValue: string;
  state: DeptState;
  sort: string;
  createdAt: string;
  children: DeptListItem[];
}

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;
