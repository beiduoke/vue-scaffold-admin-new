import {
  DomainParams,
  DomainListGetResultModel,
  DomainListItem,
  PackageParams,
  PackageListItem,
  PackageListGetResultModel,
} from './model/domainModel';
import { defHttp } from '/@/utils/http/core';

import { BasicHandleResult, State } from './model/baseModel';

const Api = {
  /** 租户管理 */
  Domain: '/domains',
  SetDomainWithIdState: (id) => `/domains/${id}/state`,
  DomainWithPidListTree: (pid) => `/domains/${pid}/trees`,
  DomainWithId: (id) => `/domains/${id}`,
  DomainWithCode: (code) => `/domains/${code}/code`,
  DomainWithName: (name) => `/domains/${name}/name`,
  DomainWithIdMenu: (id) => `/domains/${id}/menus`,
  // 租户套餐
  Package: '/domainPackages',
  SetPackageWithIdState: (id) => `/domainPackages/${id}/state`,
  PackageWithPidListTree: (pid) => `/domainPackages/${pid}/trees`,
  PackageWithId: (id) => `/domainPackages/${id}`,
  PackageWithCode: (code) => `/domainPackages/${code}/code`,
  PackageWithName: (name) => `/domainPackages/${name}/name`,
  PackageWithIdMenu: (id) => `/domainPackages/${id}/menus`,
};

/**
 *
 * @param _params 获取菜单列表-树形
 * @param id
 * @returns
 */
export const getDomainListTree = (pid: string | number = 0, _params?: DomainParams) => {
  return new Promise<DomainListItem[]>((resolve, reject) => {
    defHttp
      .get<DomainListGetResultModel>({ url: Api.DomainWithPidListTree(pid) })
      .then((data) => resolve(data.items))
      .catch((e) => reject(e));
  });
};

/**
 * 获取租户列表
 * @param params
 * @param id
 * @returns
 */
export const getDomainListByPage = (params?: DomainParams) =>
  defHttp.get<DomainListGetResultModel>({ url: Api.Domain, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 创建租户
 * @param params
 * @returns
 */
export const createDomain = (params: DomainParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Domain, params });

/**
 * 获取指定租户
 * @param params
 * @returns
 */
export const getDomainById = (id: string) =>
  // 添加http选项 在租户管理返回接口中有code 字段会造成拦截器误判
  defHttp.get<DomainListItem>({ url: Api.DomainWithId(id) }, { isTransformResponse: false });

/**
 * 获取指定租户
 * @param params
 * @returns
 */
export const getDomainByCode = (code: string) =>
  // 添加http选项 在租户管理返回接口中有code 字段会造成拦截器误判
  defHttp.get<DomainListItem>({ url: Api.DomainWithCode(code) }, { isTransformResponse: false });

/**
 * 获取指定租户
 * @param params
 * @returns
 */
export const getDomainByName = (name: string) =>
  // 添加http选项 在租户管理返回接口中有code 字段会造成拦截器误判
  defHttp.get<DomainListItem>({ url: Api.DomainWithName(name) }, { isTransformResponse: false });

/**
 * 修改租户
 * @param id
 * @param params
 * @returns
 */
export const updateDomain = (id: string, params: DomainParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.DomainWithId(id), params });

/**
 * 删除租户
 * @param id
 * @returns
 */
export const deleteDomain = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.DomainWithId(id) });

/**
 * 修改租户状态
 * @param id
 * @param params
 * @returns
 */
export const setDomainState = (id: string, state: State) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetDomainWithIdState(id), params: { state } });

/**
 * 处理租户菜单
 * @param id
 * @param params
 * @returns
 */
export const getDomainMenuList = (id: string, params: any = {}) =>
  defHttp.get({ url: Api.DomainWithIdMenu(id), params: params });
/**
 * 处理租户菜单
 * @param id
 * @param params
 * @returns
 */
export const handleDomainMenu = (id: string, params: any) =>
  defHttp.post<BasicHandleResult>({ url: Api.DomainWithIdMenu(id), params: params });

/**
 * 获取租户套餐列表
 * @param params
 * @param id
 * @returns
 */
export const getPackageListByPage = (params?: PackageParams) =>
  defHttp.get<PackageListGetResultModel>({ url: Api.Package, params }).then((data) => {
    data.total = Number(data.total);
    return data;
  });

/**
 * 创建租户套餐
 * @param params
 * @returns
 */
export const createPackage = (params: PackageParams) =>
  defHttp.post<BasicHandleResult>({ url: Api.Package, params });

/**
 * 获取指定租户套餐
 * @param params
 * @returns
 */
export const getPackageById = (id: string) =>
  // 添加http选项 在租户套餐管理返回接口中有code 字段会造成拦截器误判
  defHttp.get<PackageListItem>({ url: Api.PackageWithId(id) }, { isTransformResponse: false });

/**
 * 修改租户套餐
 * @param id
 * @param params
 * @returns
 */
export const updatePackage = (id: string, params: PackageParams) =>
  defHttp.put<BasicHandleResult>({ url: Api.PackageWithId(id), params });

/**
 * 删除租户套餐
 * @param id
 * @returns
 */
export const deletePackage = (id: string) =>
  defHttp.delete<BasicHandleResult>({ url: Api.PackageWithId(id) });

/**
 * 修改租户套餐状态
 * @param id
 * @param params
 * @returns
 */
export const setPackageState = (id: string, state: State) =>
  defHttp.put<BasicHandleResult>({ url: Api.SetPackageWithIdState(id), params: { state } });
