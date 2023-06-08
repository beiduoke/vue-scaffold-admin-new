import { BasicFetchResult, BasicPageParams } from './baseModel';

export enum DictState {
  UNSPECIFIED = 'DICT_STATE_UNSPECIFIED',
  ACTIVE = 'DICT_STATE_ACTIVE',
  INACTIVE = 'DICT_STATE_INACTIVE',
  BANNED = 'DICT_STATE_BANNED',
}
export type DictParams = {
  name?: string;
  state?: string;
};

export type DictPageParams = BasicPageParams & DictParams;

export interface DictListItem {
  id: string;
  name: string;
  type: string;
  sort: number;
  state: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type DictListGetResultModel = BasicFetchResult<DictListItem>;

export enum DictDataState {
  UNSPECIFIED = 'DICT_DATA_STATE_UNSPECIFIED',
  ACTIVE = 'DICT_DATA_STATE_ACTIVE',
  INACTIVE = 'DICT_DATA_STATE_INACTIVE',
  BANNED = 'DICT_DATA_STATE_BANNED',
}
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
  state: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type DictDataListGetResultModel = BasicFetchResult<DictDataListItem>;
