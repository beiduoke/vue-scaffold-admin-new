import { BasicFetchResult } from '/@/api/model/baseModel';

export enum DomainState {
  UNSPECIFIED = 'DOMAIN_STATE_UNSPECIFIED',
  ACTIVE = 'DOMAIN_STATE_ACTIVE',
  INACTIVE = 'DOMAIN_STATE_INACTIVE',
  BANNED = 'DOMAIN_STATE_BANNED',
}

export type DomainParams = {
  name?: string;
  state?: string;
};
export interface DomainListItem {
  id: string;
  name: string;
  sort: string;
  parentId: string;
  createdAt: string;
  remark: string;
  state: string;
  children: DomainListItem[];
}

export type DomainListGetResultModel = BasicFetchResult<DomainListItem>;
