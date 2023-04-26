import { defHttp } from '/@/utils/http/core';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  GetUserProfileModel,
  GetUserRolesModel,
  UserParams,
  UserListGetResultModel,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { BasicFetchResult, BasicPageParams, BasicHandleResult } from './model/baseModel';
import { RouteItem } from './model/menuModel';

const Api = {
  /** 用户管理 */
  User: '/users',
  UserWithId: (id) => `/users/${id}`,
  SetUserWithIdState: (id) => `/users/${id}/state`,
  UserInfo: '/users/info',
  UserProfile: '/users/profiles',
  UserRoles: '/users/roles',
  UserPageListSimple: '/users/simple',
  IsUserNameExist: '/users/existName',
  UserMenuRouterListTrees: '/users/routers/trees',
  UserMenuListTrees: '/users/menus/trees',
  UserPermCodeList: '/users/permissions',

  TestRetry: '/testRetry',
  // 认证
  LoginWithDomain: (domain) => `/auth/login/${domain}`,
  RegisterWithDomain: (domain) => `/auth/register/${domain}`,
  Logout: '/auth/logout',
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
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.UserInfo }, { errorMessageMode: 'none' });
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
 * @description: getUserProfile
 */
export function getUserProfile() {
  return defHttp.get<GetUserProfileModel>({ url: Api.UserProfile }, { errorMessageMode: 'none' });
}

/**
 * @description: getUserRoles
 */
export function getUserRoles() {
  return defHttp.get<GetUserRolesModel>({ url: Api.UserRoles }, { errorMessageMode: 'none' });
}

export interface ListUser {
  (params: BasicPageParams): Promise<UserListGetResultModel>;
}

export const getUserListByPage = (params: UserParams) =>
  defHttp.get<UserListGetResultModel>({ url: Api.User, params });

export const isUserExist = (account: string) =>
  defHttp.post(
    { url: Api.IsUserNameExist, params: { name: account } },
    { errorMessageMode: 'none' },
  );

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
export const getUserMenuRouterListTree = () => {
  return new Promise<RouteItem[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<RouteItem>>({
        url: Api.UserMenuRouterListTrees,
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
export const getUserMenuListTree = () => {
  return new Promise<RouteItem[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<RouteItem>>({ url: Api.UserMenuListTrees })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 获取用户菜单权限
 * @returns promise
 */
export function getUserPermCodeList() {
  return new Promise<string[]>((resolve, reject) => {
    defHttp
      .get<BasicFetchResult<string>>({ url: Api.UserPermCodeList })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
}
