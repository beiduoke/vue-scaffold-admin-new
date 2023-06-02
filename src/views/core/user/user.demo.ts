import { getAllRoleList } from '/@/api/core/role';
import { getDeptListTree } from '/@/api/core/dept';
import { FormSchema } from '/@/components/Form';
import { getAllPostList } from '/@/api/core/post';
export const userFormSchema: FormSchema[] = [
  {
    label: '角色',
    field: 'roles',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'name',
      valueField: 'id',
      mode: 'multiple',
    },
    show: false,
  },
  {
    field: 'deptId',
    label: '所属部门',
    required: true,
    component: 'ApiTreeSelect',
    componentProps: {
      api: getDeptListTree,
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
    },
  },
  {
    field: 'postIds',
    label: '岗位',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPostList,
      labelField: 'name',
      valueField: 'id',
    },
  },
];
