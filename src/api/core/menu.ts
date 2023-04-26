import { defHttp } from '/@/utils/http/core';
import { MenuListGetResultModel, MenuListItem, MenuParams } from './model/menuModel';
import { BasicHandleResult } from './model/baseModel';

const Api = {
  /** 菜单管理 */
  Menu: '/menus',
  MenuWithId: (id) => `/menus/${id}`,
  SetMenuWithId: (id) => `/menus/${id}/state`,
  MenuWithPidListTree: (pid) => `/menus/${pid}/trees`,
};

/**
 *
 * @param _params 获取菜单列表-树形
 * @param id
 * @returns
 */
export const getMenuListTree = (pid: string | number = 0, params?: MenuParams) => {
  return new Promise<MenuListItem[]>((resolve, reject) => {
    defHttp
      .get<MenuListGetResultModel>({
        url: Api.MenuWithPidListTree(pid),
        params: { ...params, nopaging: true },
      })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 创建菜单
 * @param params
 * @returns
 */
export const createMenu = (params: MenuParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Menu, params });

/**
 * 获取菜单
 * @param params
 * @returns
 */
export const getMenuById = (id: string) => defHttp.get<MenuListItem>({ url: Api.MenuWithId(id) });

/**
 * 删除菜单
 * @param id
 * @returns
 */
export const deleteMenu = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.MenuWithId(id) });

/**
 * 修改菜单
 * @param params
 * @returns
 */

export const updateMenu = (id: string, params: MenuParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.MenuWithId(id), params });
