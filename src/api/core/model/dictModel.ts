import { BasicFetchResult, BasicPageParams, State } from './baseModel';

export type DictParams = {
  name?: string;
  state?: State;
};

export type DictPageParams = BasicPageParams & DictParams;

export interface DictListItem {
  id: string;
  name: string;
  type: string;
  sort: number;
  state: State;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type DictListGetResultModel = BasicFetchResult<DictListItem>;

export type DictDataParams = {
  label?: string;
  state?: string;
};

export type DictDataPageParams = BasicPageParams & DictDataParams;

export interface DictDataListItem {
  id: string;
  label: string;
  value: string;
  color_type: string;
  css_class: string;
  dict_type: string;
  sort: number;
  state: State;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type DictDataListGetResultModel = BasicFetchResult<DictDataListItem>;
