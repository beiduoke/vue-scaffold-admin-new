import { BasicFetchResult, State } from '.././model/baseModel';

export type PostParams = {
  name?: string;
  state?: State;
};
export interface PostListItem {
  id: string;
  name: string;
  sort: string;
  code: string;
  createdAt: string;
  remark: string;
  state: State;
}

export type PostListGetResultModel = BasicFetchResult<PostListItem>;
