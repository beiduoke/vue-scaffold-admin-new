import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { useDebounceFn } from '@vueuse/core';
import pinyin from 'pinyin';
import {
  MenuAffix,
  MenuLinkType,
  MenuHidden,
  MenuCache,
  MenuParameterType,
  MenuType,
} from '/@/api/core/model/menuModel';

export const columns: BasicColumn[] = [
  {
    title: '菜单标题',
    dataIndex: 'title',
    width: 200,
    align: 'left',
    fixed: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '菜单类型',
    dataIndex: 'type',
    width: 100,
    align: 'left',
    customRender: ({ record }) => {
      let text = '目录';
      switch (record.type as MenuType) {
        case MenuType.MENU:
          text = '菜单';
          break;
        case MenuType.ABILITY:
          text = '按钮';
          break;
      }
      return h(Tag, { color: 'blue' }, () => text);
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    align: 'left',
    ifShow: false,
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 200,
    align: 'left',
  },
  {
    title: '地址',
    dataIndex: 'path',
    width: 150,
    align: 'left',
  },
  {
    title: '组件',
    dataIndex: 'component',
    maxWidth: 400,
  },
  {
    title: '是否隐藏',
    dataIndex: 'isHidden',
    width: 80,
    customRender: ({ record }) => {
      const status = record.isHidden as string;
      const enable = status === MenuHidden.NO.toString();
      const color = enable ? 'green' : 'red';
      const text = enable ? '显示' : '隐藏';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ value }) => formatToDateTime(value),
  },
];

const isDir = (type: string | keyof MenuType) => type === MenuType.CATALOGUE;
const isMenu = (type: string | keyof MenuType) => type === MenuType.MENU;
const isAbility = (type: string | keyof MenuType) => type === MenuType.ABILITY;

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '菜单标题',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'isHidden',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: MenuHidden.NO },
        { label: '停用', value: MenuHidden.YES },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    defaultValue: 0,
    componentProps: {
      fieldNames: {
        label: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: MenuType.MENU,
    componentProps: {
      options: [
        { label: '目录', value: MenuType.CATALOGUE },
        { label: '菜单', value: MenuType.MENU },
        { label: '按钮', value: MenuType.ABILITY },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'title',
    label: '菜单标题',
    component: 'Input',
    required: true,
    helpMessage: '输入完成菜单标题后自动生成名称',
    componentProps: ({ formModel, formActionType }) => {
      const titleDebounce = useDebounceFn((e) => {
        const value = e.target.value;
        const py = pinyin(value, { style: 0, mode: 0, segment: false, compact: true });
        if (formModel.name === '' || formModel.name === undefined) {
          formModel.name = py.join('');
          formActionType.setFieldsValue({ name: py.join('') });
        } else {
          console.log('名称存在不进行覆盖');
        }
      }, 300);
      return {
        placeholder: '输入显示菜单标题',
        onchange: titleDebounce,
      };
    },
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    // ifShow: ({ values }) => !isAbility(values.type),
    helpMessage: '名称为字母以及下划线',
    componentProps: ({ formModel }) => {
      let placeholder = '请输入名称';
      if (isMenu(formModel.type)) {
        placeholder = '请输入菜单名称';
      } else if (isAbility(formModel.type)) {
        placeholder = '请输入按钮名称';
      }
      return {
        placeholder: placeholder,
      };
    },
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'path',
    label: '地址',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '路由中的 path 值',
    },
    ifShow: ({ values }) => !isAbility(values.type),
  },
  {
    field: 'redirect',
    label: '重定向地址',
    component: 'Input',
    helpMessage: '单path地址错误或者组件路径不存在显示跳转到重定向地址',
    defaultValue: '',
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    helpMessage: '当组件路径为“LAYOUT”时，该菜单为目录',
    ifShow: ({ values }) => isMenu(values.type) && !isAbility(values.linkType),
    required: ({ values }) => values.linkType === MenuLinkType.NO,
    componentProps: { placeholder: '输入组建路径' },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 100,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    componentProps: {
      placeholder: '输入权限标识',
    },
    defaultValue: '',
    ifShow: ({ values }) => !isDir(values.type),
  },
  {
    field: 'remarks',
    label: '备注',
    component: 'InputTextArea',
    defaultValue: '',
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'isHidden',
    label: '是否隐藏',
    component: 'RadioButtonGroup',
    defaultValue: MenuHidden.NO,
    componentProps: {
      options: [
        { label: '是', value: MenuHidden.YES },
        { label: '否', value: MenuHidden.NO },
      ],
    },
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'linkType',
    label: '外链设置',
    component: 'RadioButtonGroup',
    defaultValue: MenuLinkType.NO,
    componentProps: ({ formActionType }) => {
      const updateLinkUrl = (disabled = false) =>
        formActionType.updateSchema({ field: 'linkUrl', componentProps: { disabled } });
      return {
        options: [
          { label: '无外链', value: MenuLinkType.NO },
          { label: '内嵌', value: MenuLinkType.IFRAME },
          { label: '跳转', value: MenuLinkType.BLANK },
        ],
        onchange: (e) => {
          const val = e.target.value;
          let disabled = false;
          if ((val as MenuLinkType) === MenuLinkType.NO) {
            disabled = true;
          } else {
            formActionType.updateSchema({
              field: 'component',
              defaultValue: '/core/iframe/FrameBlank',
            });
          }
          updateLinkUrl(disabled);
        },
      };
    },
    ifShow: ({ values }) => isMenu(values.type),
    colProps: { lg: 12, md: 12 },
    // show: false,
  },
  {
    field: 'linkUrl',
    component: 'Input',
    label: '外链地址',
    colProps: { lg: 12, md: 12 },
    componentProps: {
      placeholder: '输入外链地址',
    },
    required: ({ values }) => values.linkType != MenuLinkType.NO,
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'isCache',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: MenuCache.NO,
    componentProps: {
      options: [
        { label: '否', value: MenuCache.NO },
        { label: '是', value: MenuCache.YES },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type),
    colProps: { lg: 5, md: 12 },
  },
  {
    field: 'isAffix',
    label: '是否固定',
    component: 'RadioButtonGroup',
    defaultValue: MenuAffix.NO,
    componentProps: {
      options: [
        { label: '否', value: MenuAffix.NO },
        { label: '是', value: MenuAffix.YES },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type),
    colProps: { lg: 5, md: 12 },
  },
];

export const paramsColumns: BasicColumn[] = [
  {
    title: '参数类型',
    dataIndex: 'type',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: [
        {
          label: 'Query',
          value: MenuParameterType.QUERY,
        },
        {
          label: 'Param',
          value: MenuParameterType.PARAMS,
        },
      ],
    },
  },
  {
    title: '参数名',
    dataIndex: 'name',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '参数值',
    dataIndex: 'value',
    editComponent: 'Input',
    editRow: true,
  },
];

export const buttonsColumns: BasicColumn[] = [
  {
    title: '按钮名',
    dataIndex: 'name',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '按钮备注',
    dataIndex: 'remarks',
    editComponent: 'Input',
    editRow: true,
  },
];
