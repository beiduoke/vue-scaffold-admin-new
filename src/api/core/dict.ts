import {
  DictListGetResultModel,
  DictParams,
  DictPageParams,
  DictDataParams,
  DictDataPageParams,
  DictDataListGetResultModel,
  DictListItem,
} from './model/dictModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult } from './model/baseModel';

const Api = {
  /** 字典管理 */
  Dict: '/dicts',
  DictWithId: (id) => `/dicts/${id}`,
  SetDictWithIdState: (id) => `/dicts/${id}/state`,
  DictData: '/dictData',
  DictDataWithId: (id) => `/dictData/${id}`,
  SetDictDataWithIdState: (id) => `/dictData/${id}/state`,
};

/**
 * 字典列表无分页
 * @param params
 * @returns
 */
export const getAllDictList = (params?: DictPageParams) => {
  return new Promise<DictListItem[]>((resolve, reject) => {
    defHttp
      .get<DictListGetResultModel>({ url: Api.Dict, params: { ...params, nopaging: true } })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 字典列表分页
 * @param params
 * @returns
 */
export const getDictListByPage = (params?: DictPageParams) =>
  defHttp.get<DictListGetResultModel>({ url: Api.Dict, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 创建字典
 * @param params
 * @returns
 */
export const createDict = (params: DictParams) =>
  defHttp.post<BasicHandleResult>({
    url: Api.Dict,
    params: params,
  });

/**
 * 设置字典状态
 * @param id
 * @param state
 * @returns
 */
export const setDictState = (id: string, state: string) =>
  defHttp.put<BasicHandleResult>({
    url: Api.SetDictWithIdState(id),
    params: { state },
  });

/**
 * 字典修改
 * @param id
 * @param params
 * @returns
 */
export const updateDict = (id: string, params: DictParams) =>
  defHttp.put<BasicHandleResult>({
    url: Api.DictWithId(id),
    params: params,
  });

/**
 * 删除字典
 * @param id
 * @returns
 */
export const deleteDict = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.DictWithId(id) });

/**
 * 字典数据列表分页
 * @param params
 * @returns
 */
export const getDictDataListByPage = (params?: DictDataPageParams) =>
  defHttp.get<DictDataListGetResultModel>({ url: Api.DictData, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 创建字典数据
 * @param params
 * @returns
 */
export const createDictData = (params: DictDataParams) =>
  defHttp.post<BasicHandleResult>({
    url: Api.DictData,
    params: params,
  });

/**
 * 设置字典数据状态
 * @param id
 * @param state
 * @returns
 */
export const setDictDataState = (id: string, state: string) =>
  defHttp.put<BasicHandleResult>({
    url: Api.SetDictDataWithIdState(id),
    params: { state },
  });

/**
 * 字典数据修改
 * @param id
 * @param params
 * @returns
 */
export const updateDictData = (id: string, params: DictDataParams) =>
  defHttp.put<BasicHandleResult>({
    url: Api.DictDataWithId(id),
    params: params,
  });

/**
 * 删除字典数据
 * @param id
 * @returns
 */
export const deleteDictData = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.DictDataWithId(id) });
