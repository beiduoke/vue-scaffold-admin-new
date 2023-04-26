import { ResourceParams, ResourcePageParams } from './model/resourceModel';
import { defHttp } from '/@/utils/http/core';

import { BasicFetchResult, BasicHandleResult } from './model/baseModel';
import { RoleListGetResultModel } from './model/roleModel';

const Api = {
  /** 资源管理 */
  Resource: '/resources',
  ResourceGroupList: '/resources/groups',
  ResourceWithId: (id) => `/resources/${id}`,
  SetResourceWithIdState: (id) => `/resources/${id}/state`,
};

/**
 * 资源列表分页
 * @param params
 * @returns
 */
export const getResourceListByPage = (params?: ResourcePageParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.Resource, params });

/**
 * 资源列表-分组
 * @param params
 * @returns
 */
export const getResourceGroupList = async () => {
  const groupList = await defHttp.get<BasicFetchResult<string>>({ url: Api.ResourceGroupList });
  return groupList.items.map((item) => {
    return { label: item, value: item };
  });
};

/**
 * 创建资源
 * @param params
 * @returns
 */
export const createResource = (params: ResourceParams) =>
  defHttp.post<BasicHandleResult>({
    url: Api.Resource,
    params: params,
  });

/**
 * 设置资源状态
 * @param id
 * @param state
 * @returns
 */
export const setResourceState = (id: string, state: string) =>
  defHttp.put<BasicHandleResult>({
    url: Api.ResourceWithId(id),
    params: { state },
  });

/**
 * 资源修改
 * @param id
 * @param params
 * @returns
 */
export const updateResource = (id: string, params: ResourceParams) =>
  defHttp.put<BasicHandleResult>({
    url: Api.ResourceWithId(id),
    params: params,
  });

/**
 * 删除资源
 * @param id
 * @returns
 */
export const deleteResource = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.ResourceWithId(id) });
