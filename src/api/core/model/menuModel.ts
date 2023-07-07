import type { RouteMeta } from 'vue-router';
import { BasicFetchResult, Enable, State } from '.././model/baseModel';

export enum MenuState {
  UNSPECIFIED,
  ACTIVE,
  INACTIVE,
  BANNED,
}

export enum MenuType {
  UNSPECIFIED,
  CATALOGUE,
  MENU,
  ABILITY,
}

export enum MenuLinkType {
  UNSPECIFIED,
  NO,
  IFRAME,
  BLANK,
}

export enum MenuParameterType {
  UNSPECIFIED,
  PARAMS,
  QUERY,
}

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children: RouteItem[];
  parentId: string;
  id: string;
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

export type MenuParams = {
  name?: string;
  state?: State;
};

export interface MenuListItem {
  id: string;
  sort: string;
  parentId: string;
  createdAt: string;
  state: State;
  icon: string;
  name: string;
  type: MenuType;
  permission: string;
  component: string;
  title: string;
  isHidden: Enable;
  isAffix: Enable;
  isCache: Enable;
  linkType: MenuLinkType;
  linkUrl: string;
  children: MenuListItem[];
  parameters: MenuParameterListItem[];
  buttons: MenuButtonListItem[];
}

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export interface MenuParameterListItem {
  type: MenuParameterType | string;
  name: string;
  value: string;
}

export interface MenuButtonListItem {
  name: string;
  remarks: string;
}
