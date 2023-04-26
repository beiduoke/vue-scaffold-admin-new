import { getResourceGroupList } from '/@/api/core/resource';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ value }) => formatToDateTime(value),
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '分组',
    dataIndex: 'group',
    width: 100,
  },
  {
    title: '路径',
    dataIndex: 'path',
    width: 200,
  },
  {
    title: '方法',
    dataIndex: 'method',
    width: 50,
  },
  {
    title: '动作',
    dataIndex: 'operation',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'group',
    label: '分组',
    component: 'ApiSelect',
    componentProps: {
      numberToString: true,
      immediate: true,
      api: getResourceGroupList,
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'path',
    label: '路径',
    required: true,
    component: 'Input',
  },
  {
    field: 'method',
    label: '方法',
    required: true,
    defaultValue: '*',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'ALL', value: '*' },
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'HEAD', value: 'HEAD' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' },
        { label: 'OPTIONS', value: 'OPTIONS' },
        { label: 'CONNECT', value: 'CONNECT' },
        { label: 'TRACE', value: 'TRACE' },
      ],
    },
  },
  {
    field: 'group',
    label: '分组',
    component: 'Input',
    defaultValue: '默认',
  },
  {
    field: 'operation',
    label: '动作',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
];
