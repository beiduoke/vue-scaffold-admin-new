import { BasicFetchResult } from '.././model/baseModel';

export enum PostState {
  UNSPECIFIED = 'POST_STATE_UNSPECIFIED',
  ACTIVE = 'POST_STATE_ACTIVE',
  INACTIVE = 'POST_STATE_INACTIVE',
  BANNED = 'POST_STATE_BANNED',
}

export type PostParams = {
  name?: string;
  state?: string;
};
export interface PostListItem {
  id: string;
  name: string;
  sort: string;
  code: string;
  createdAt: string;
  remark: string;
  state: string;
}

export type PostListGetResultModel = BasicFetchResult<PostListItem>;
