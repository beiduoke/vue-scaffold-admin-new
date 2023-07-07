import { PostParams, PostListGetResultModel, PostListItem } from './model/postModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult, State } from './model/baseModel';

const Api = {
  /** 岗位管理 */
  Post: '/posts',
  PostWithId: (id) => `/posts/${id}`,
  SetPostWithIdState: (id) => `/posts/${id}/state`,
};

/**
 * 岗位全部列表
 * @param params
 * @returns
 */
export const getAllPostList = (params?: PostParams | any) => {
  return new Promise<PostListItem[]>((resolve, reject) => {
    defHttp
      .get<PostListGetResultModel>({ url: Api.Post, params: { ...params, nopaging: true } })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 获取岗位列表
 * @param params
 * @returns
 */
export const getPostListByPage = (params?: PostParams) =>
  defHttp.get<PostListGetResultModel>({ url: Api.Post, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 创建岗位
 * @param params
 * @returns
 */
export const createPost = (params: PostParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Post, params });

/**
 * 修改岗位
 * @param id
 * @param params
 * @returns
 */
export const updatePost = (id: string, params: PostParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.PostWithId(id), params });

/**
 * 删除岗位
 * @param id
 * @returns
 */
export const deletePost = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.PostWithId(id) });

/**
 * 修改岗位
 * @param id
 * @param params
 * @returns
 */
export const setPostState = (id: string, state: State) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetPostWithIdState(id), params: { state } });
