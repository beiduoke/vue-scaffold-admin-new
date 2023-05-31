import { Avatar, Tag } from 'ant-design-vue/lib/components';
import { h } from 'vue';
import { isUserExist } from '../../../api/core/user';
import { UserState } from '/@/api/core/model/userModel';
import { getAllRoleList } from '/@/api/core/role';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { getAllPostList } from '/@/api/core/post';
import { getDeptListTree } from '/@/api/core/dept';

export const columns: BasicColumn[] = [
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 120,
    customRender: ({ value }) => {
      value = value || '/src/assets/images/header.jpg';
      return h(Avatar, {
        shape: 'circle',
        size: 60,
        src: value,
      });
    },
  },
  {
    title: '用户名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: 200,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 80,
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === UserState.ACTIVE;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ value }) => formatToDateTime(value),
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const userFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    helpMessage: ['不能输入重复的用户名'],
    rules: [
      {
        min: 3,
        max: 20,
        required: true,
        message: '请输入用户名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            isUserExist(value)
              .then((data) => (data.success ? reject(data.message) : resolve()))
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'deptId',
    label: '所属部门',
    required: true,
    component: 'ApiTreeSelect',
    defaultValue: 0,
    componentProps: {
      api: getDeptListTree,
      labelField: 'name',
      valueField: 'id',
    },
    // {
    //   fieldNames: {
    //     label: 'name',
    //     key: 'id',
    //     value: 'id',
    //   },
    //   getPopupContainer: () => document.body,
    // },
  },
  {
    field: 'postId',
    label: '岗位',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPostList,
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    label: '手机号',
    field: 'mobile',
    component: 'Input',
    required: true,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },
  {
    field: 'state',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: UserState.ACTIVE,
    componentProps: {
      options: [
        { label: '启用', value: UserState.ACTIVE },
        { label: '停用', value: UserState.INACTIVE },
      ],
    },
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
