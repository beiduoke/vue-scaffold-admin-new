import type { RouteMeta } from 'vue-router';
import { BasicFetchResult } from '.././model/baseModel';

export enum MenuType {
  UNSPECIFIED = 'MENU_TYPE_UNSPECIFIED',
  CATALOGUE = 'MENU_TYPE_CATALOGUE',
  MENU = 'MENU_TYPE_MENU',
  ABILITY = 'MENU_TYPE_ABILITY',
}

export enum MenuState {
  UNSPECIFIED = 'MENU_STATE_UNSPECIFIED',
  ACTIVE = 'MENU_STATE_ACTIVE',
  INACTIVE = 'MENU_STATE_INACTIVE',
  BANNED = 'MENU_STATE_BANNED',
}

export enum MenuHidden {
  UNSPECIFIED = 'MENU_HIDDEN_UNSPECIFIED',
  YES = 'MENU_HIDDEN_YES',
  NO = 'MENU_HIDDEN_NO',
}

export enum MenuCache {
  UNSPECIFIED = 'MENU_CACHE_UNSPECIFIED',
  YES = 'MENU_CACHE_YES',
  NO = 'MENU_CACHE_NO',
}

export enum MenuAffix {
  UNSPECIFIED = 'MENU_Affix_UNSPECIFIED',
  YES = 'MENU_AFFIX_YES',
  NO = 'MENU_AFFIX_NO',
}

export enum MenuLinkType {
  UNSPECIFIED = 'MENU_LINK_TYPE_UNSPECIFIED',
  NO = 'MENU_LINK_TYPE_NO',
  IFRAME = 'MENU_LINK_TYPE_IFRAME',
  BLANK = 'MENU_LINK_TYPE_BLANK',
}

export enum MenuParameterType {
  UNSPECIFIED = 'MENU_PARAMETER_TYPE_UNSPECIFIED',
  PARAMS = 'MENU_PARAMETER_TYPE_PARAMS',
  QUERY = 'MENU_PARAMETER_TYPE_QUERY',
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
  state?: string;
};

export interface MenuListItem {
  id: string;
  sort: string;
  parentId: string;
  createdAt: string;
  state: MenuState;
  icon: string;
  name: string;
  type: MenuType;
  permission: string;
  component: string;
  title: string;
  isHidden: MenuHidden;
  isAffix: MenuAffix;
  isCache: MenuCache;
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
