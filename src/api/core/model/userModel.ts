import { BasicFetchResult, BasicPageParams, State } from '.././model/baseModel';

export enum UserGender {
  UNSPECIFIED,
  MAN,
  WOMAN,
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  domain: string;
  account: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * 这里作为系统特殊处理字段需按以下要求
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // 用户id
  id?: string | number;
}

/**
 * @description: Get user information return value
 */
export interface GetUserProfileModel {
  user: UserModel;
  authorities: RoleModel[];
}

/**
 * @description: Define user api return value
 */
export interface UserModel {
  id: string;
  name: string;
  nickName: string;
  realName: string;
  mobile: string;
  avatar: string;
  birthday: string;
  createdAt: string;
  email: string;
  gender: UserGender;
  state: State;
  updatedAt: string;
}

/**
 * @description: Define authority role api return value
 */
export interface RoleModel {
  createdAt: string;
  updatedAt: string;
  defaultRouter: string;
  id: number | string;
  name: string;
  parentId: number | string;
  sort: number | string;
  state: State;
}

/**
 * @description: Get user information return value
 */
export interface GetUserRolesModel {
  items: RoleModel[];
  total: number | string;
}

export type UserParams = BasicPageParams & {
  name?: string;
  nickname?: string;
  state?: State;
};

export interface UserListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  roleIds: number[];
  postIds: number[];
  createTime: string;
  remark: string;
  state: State;
  deptId: number;
}

export type UserListGetResultModel = BasicFetchResult<UserListItem>;
