import { BasicFetchResult, BasicPageParams } from '.././model/baseModel';

export type ResourceParams = {
  name?: string;
  state?: string;
};

export type ResourcePageParams = BasicPageParams & ResourceParams;

export interface ResourceListItem {
  id: string;
  name: string;
  path: string;
  method: string;
  group: string;
  description: string;
  operation: string;
  createdAt: string;
  updatedAt: string;
}

export type ResourceListGetResultModel = BasicFetchResult<ResourceListItem>;
