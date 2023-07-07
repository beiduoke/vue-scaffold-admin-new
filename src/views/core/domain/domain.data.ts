import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setDomainState } from '/@/api/core/domain';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { State } from '/@/api/core/model/baseModel';

export const columns: BasicColumn[] = [
  {
    title: '租户名称',
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
        checked: record.state === State.ACTIVE,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? State.ACTIVE : State.INACTIVE;
          const { createMessage } = useMessage();
          setDomainState(record.id, newStatus)
            .then(() => {
              record.state = newStatus;
              createMessage.success(`已成功修改租户状态`);
            })
            .catch(() => {
              createMessage.error('修改租户状态失败');
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
    field: 'name',
    label: '租户名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'state',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: State.ACTIVE },
        { label: '停用', value: State.INACTIVE },
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
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'name',
    label: '租户名称',
    required: true,
    component: 'Input',
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
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
  },
];

export const menuFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '租户名称',
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
