import { Avatar, Tag } from 'ant-design-vue/lib/components';
import { h } from 'vue';
import { isUserExist } from '../../../api/core/user';
import { UserGender } from '/@/api/core/model/userModel';

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { getAllPostList } from '/@/api/core/post';

import { RoleListItem } from '/@/api/core/model/roleModel';
import { DeptListItem } from '/@/api/core/model/deptModel';
import { State } from '/@/api/core/model/baseModel';

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
    title: '性别',
    dataIndex: 'gender',
    width: 50,
    customRender: ({ record }) => {
      let color = 'pink';
      let text = '未知';
      switch (record.gender) {
        case UserGender.MAN:
          text = '男';
          color = 'blue';
          break;
        case UserGender.WOMAN:
          text = '女';
          color = 'red';
          break;
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 120,
  },
  {
    title: '部门',
    dataIndex: 'deptId',
    width: 120,
    customRender: ({ record }) => {
      if (record.deptId > 0) {
        const dept = record.dept as DeptListItem;
        return h(Tag, { color: 'blue' }, () => dept.name);
      }
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'roleIds',
    width: 200,
    customRender: ({ record }) => {
      const roles = record.roles as RoleListItem[];
      return h(
        'div',
        roles.map((v) => h(Tag, { color: 'green' }, () => v.name)),
      );
    },
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
      const enable = state === State.ACTIVE;
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
    field: 'deptId',
    label: '所属部门',
    required: true,
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
    },
    colProps: { lg: 24, md: 24 },
  },
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
    defaultValue: '',
    rules: [{ required: true, message: '请输入六位密码' }],
  },
  {
    label: '角色',
    field: 'roleIds',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      placeholder: '请选择角色（可多选）',
    },
    required: true,
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'gender',
    label: '性别',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: '男', value: UserGender.MAN },
        { label: '女', value: UserGender.WOMAN },
        { label: '未知', value: UserGender.UNSPECIFIED },
      ],
    },
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    required: true,
    rules: [{ required: true, message: '请输入正确手机号' }],
  },
  {
    field: 'realName',
    label: '真实名称',
    component: 'Input',
    defaultValue: '',
  },
  {
    field: 'postIds',
    label: '岗位',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      placeholder: '请选择岗位（可多选）',
    },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '输入后将进行邮箱验证',
    },
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
    componentProps: {
      placeholder: '选择出生年月',
    },
  },
  {
    field: 'state',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: State.ACTIVE,
    componentProps: {
      options: [
        { label: '启用', value: State.ACTIVE },
        { label: '停用', value: State.INACTIVE },
      ],
    },
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
];
