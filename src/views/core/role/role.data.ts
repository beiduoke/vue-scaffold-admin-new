import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleState } from '/@/api/core/role';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { RoleState } from '/@/api/core/model/roleModel';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        disabled: false,
        checked: record.state === RoleState.ACTIVE,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? RoleState.ACTIVE : RoleState.INACTIVE;
          const { createMessage } = useMessage();
          setRoleState(record.id, newStatus)
            .then(() => {
              record.state = newStatus;
              createMessage.success(`已成功修改角色状态`);
            })
            .catch(() => {
              createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
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
    dataIndex: 'remarks',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: RoleState.ACTIVE },
        { label: '停用', value: RoleState.INACTIVE },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '角色排序',
    component: 'InputNumber',
    required: true,
    defaultValue: 100,
  },
  {
    field: 'state',
    label: '角色状态',
    component: 'RadioButtonGroup',
    defaultValue: RoleState.ACTIVE,
    componentProps: {
      options: [
        { label: '启用', value: RoleState.ACTIVE },
        { label: '停用', value: RoleState.INACTIVE },
      ],
    },
  },
  {
    label: '角色备注',
    field: 'remarks',
    component: 'InputTextArea',
  },
];

export const dataFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
    componentProps: { disabled: true },
  },
];

export const menuFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    defaultValue: [],
    component: 'Input',
  },
];
