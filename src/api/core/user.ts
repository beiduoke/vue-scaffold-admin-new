import { defHttp } from '/@/utils/http/core';
import {
  LoginParams,
  LoginResultModel,
  GetAccessInfoModel,
  GetAccessProfileModel,
  GetAccessRolesModel,
  UserParams,
  UserListGetResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { BasicFetchResult, BasicPageParams, BasicHandleResult, State } from './model/baseModel';
import { MenuListItem, RouteItem } from './model/menuModel';

const Api = {
  /** 用户管理 */
  User: '/users',
  UserPageListSimple: '/users/simple',
  UserWithId: (id) => `/users/${id}`,
  SetUserWithIdState: (id) => `/users/${id}/state`,
  IsUserNameExist: '/users/existName',

  TestRetry: '/testRetry',
  // 认证
  LoginWithDomain: (domain) => `/auth/login/${domain}`,
  RegisterWithDomain: (domain) => `/auth/register/${domain}`,
  Logout: '/auth/logout',
  AccessInfo: '/auth/info',
  AccessProfile: '/auth/profiles',
  AccessRoles: '/auth/roles',
  AccessMenuRouterListTrees: '/auth/routers/trees',
  AccessMenuListTrees: '/auth/menus/trees',
  AccessPermCodeList: '/auth/permissions',
};

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LoginWithDomain(params.domain),
      data: params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getAccessInfo
 */
export function getAccessInfo() {
  return defHttp.get<GetAccessInfoModel>({ url: Api.AccessInfo }, { errorMessageMode: 'none' });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

/**
 * @description: getAccessProfile
 */
export function getAccessProfile() {
  return defHttp.get<GetAccessProfileModel>(
    { url: Api.AccessProfile },
    { errorMessageMode: 'none' },
  );
}

/**
 * @description: getAccessRoles
 */
export function getAccessRoles() {
  return defHttp.get<GetAccessRolesModel>({ url: Api.AccessRoles }, { errorMessageMode: 'none' });
}

export interface ListUser {
  (params: BasicPageParams): Promise<UserListGetResultModel>;
}

export const getUserListByPage = (params: UserParams) =>
  defHttp.get<UserListGetResultModel>({ url: Api.User, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

export const isUserExist = (account: string) =>
  defHttp.post(
    { url: Api.IsUserNameExist, params: { name: account } },
    { errorMessageMode: 'none' },
  );

export const createUser = (params: UserParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.User, params: params });

/**
 * 修改用户
 * @param id
 * @param params
 * @returns
 */
export const updateUser = (id: string, params: UserParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.UserWithId(id), params: params });
/**
 * 设置状态
 * @param id
 * @param params
 * @returns
 */
export const setUserState = (id: string, state: State) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetUserWithIdState(id), params: { state } });

/**
 * 删除用户
 * @param id
 * @returns
 */
export const deleteUser = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.UserWithId(id) });

/**
 * 获取用户菜单路由列表-树形
 * @returns promise
 */
export const getAccessMenuRouterListTree = () => {
  return new Promise<RouteItem[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<RouteItem>>({
        url: Api.AccessMenuRouterListTrees,
      })
      .then((data) => {
        resolve(data.items);
      })
      .catch((e) => reject(e));
  });
};

/**
 * 获取用户菜单列表-树形
 * @returns promise
 */
export const getAccessMenuListTree = () => {
  return new Promise<MenuListItem[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<MenuListItem>>({ url: Api.AccessMenuListTrees })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 获取用户菜单权限
 * @returns promise
 */
export function getAccessPermCodeList() {
  return new Promise<string[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<string>>({ url: Api.AccessPermCodeList })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
}
