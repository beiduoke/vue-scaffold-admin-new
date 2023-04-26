import { RoleParams, RolePageParams, RoleListGetResultModel } from './model/roleModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult } from './model/baseModel';
import { MenuListGetResultModel } from './model/menuModel';
import { DeptListGetResultModel } from './model/deptModel';

const Api = {
  /** 权限角色管理 */
  Role: '/roles',
  RoleWithId: (id) => `/roles/${id}`,
  SetRoleWithIdState: (id) => `/roles/${id}/state`,
  RoleWithIdMenu: (id) => `/roles/${id}/menus`,
  RoleWithIdData: (id) => `/roles/${id}/data`,
};

/**
 * 角色列表分页
 * @param params
 * @returns
 */
export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.Role, params });
/**
 * 角色全部列表
 * @param params
 * @returns
 */
export const getAllRoleList = (params?: RoleParams | any) => {
  return new Promise((resolve, reject) => {
    defHttp
      .get<RoleListGetResultModel>({ url: Api.Role, params: { ...params, nopaging: true } })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

export const createRole = (params: RoleParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Role, params: params });

/**
 * 角色修改
 * @param id
 * @param params
 * @returns
 */
export const updateRole = (id: string, params: RoleParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.RoleWithId(id), params: params });

/**
 * 删除菜单
 * @param id
 * @returns
 */
export const deleteRole = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.RoleWithId(id) });

/**
 * 设置状态
 * @param id
 * @param state
 * @returns
 */
export const setRoleState = (id: string, state: string) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetRoleWithIdState(id), params: { state } });

/**
 * 获取角色菜单
 * @param id
 * @param params
 * @returns
 */
export const getRoleMenuList = (id: string, params: any = {}) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.RoleWithIdMenu(id), params: params });
/**
 * 处理角色菜单
 * @param id
 * @param params
 * @returns
 */
export const handleRoleMenu = (id: string | number, params: any) =>
  defHttp.post<BasicHandleResult>({ url: Api.RoleWithIdMenu(id), params: params });
/**
 * 处理角色数据
 * @param id
 * @param params
 * @returns
 */
export const getRoleDataList = (id: string | number, params: any) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.RoleWithIdData(id), params: params });

/**
 * 处理角色数据
 * @param id
 * @param params
 * @returns
 */
export const handleRoleData = (id: string | number, params: any) =>
  defHttp.post<BasicHandleResult>({ url: Api.RoleWithIdData(id), params: params });
