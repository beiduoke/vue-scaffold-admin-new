import { DeptListGetResultModel, DeptListItem, DeptParams, DeptState } from './model/deptModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult } from './model/baseModel';

const Api = {
  /** 部门管理 */
  Dept: '/depts',
  DeptWithId: (id) => `/depts/${id}`,
  SetDeptWithIdState: (id) => `/depts/${id}/state`,
  DeptListWithPidTree: (pid) => `/depts/${pid}/trees`,
};

/**
 * 获取部门列表
 * @param params
 * @param id
 * @returns
 */
export const getDeptListByPage = (params?: DeptParams) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.Dept, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 获取部门列表-树形
 * @param params
 * @param id
 * @returns
 */
export const getDeptListTree = (pid: string | number = 0, params?: DeptParams) => {
  return new Promise<DeptListItem[]>((resolve, reject) => {
    defHttp
      .get<DeptListGetResultModel>({
        url: Api.DeptListWithPidTree(pid),
        params: { ...params, nopaging: true },
      })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 创建部门
 * @param params
 * @returns
 */
export const createDept = (params: DeptParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Dept, params });

/**
 * 修改部门
 * @param id
 * @param params
 * @returns
 */
export const updateDept = (id: string, params: DeptParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.DeptWithId(id), params });

/**
 * 删除部门
 * @param id
 * @returns
 */
export const deleteDept = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.DeptWithId(id) });

/**
 * 修改部门状态
 * @param id
 * @param params
 * @returns
 */
export const setDeptState = (id: string, state: DeptState) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetDeptWithIdState(id), params: { state } });
