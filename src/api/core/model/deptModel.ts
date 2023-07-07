import { BasicFetchResult, BasicPageParams, State } from '.././model/baseModel';

export type DeptParams = {
  name?: string;
  state?: string;
};

export type DeptPageParams = BasicPageParams & DeptParams;

export interface DeptListItem {
  id: string;
  name: string;
  state: State;
  sort: string;
  createdAt: string;
  children: DeptListItem[];
}

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;
