import { PostParams, PostListGetResultModel, PostState } from './model/postModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult } from './model/baseModel';

const Api = {
  /** 岗位管理 */
  Post: '/posts',
  PostWithId: (id) => `/posts/${id}`,
  SetPostWithIdState: (id) => `/posts/${id}/state`,
};

/**
 * 获取岗位列表
 * @param params
 * @returns
 */
export const getPostListByPage = (params?: PostParams) =>
  defHttp.get<PostListGetResultModel>({ url: Api.Post, params });

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
export const setPostState = (id: string, state: PostState) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetPostWithIdState(id), params: { state } });
