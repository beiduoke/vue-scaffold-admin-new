import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setDictState } from '/@/api/core/dict';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { State } from '/@/api/core/model/baseModel';

export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '字典类型',
    dataIndex: 'type',
    width: 200,
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
          setDictState(record.id, newStatus)
            .then(() => {
              record.state = newStatus;
              createMessage.success(`字典状态修改成功`);
            })
            .catch(() => {
              createMessage.error('字典状态修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
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
  {
    title: '备注',
    dataIndex: 'remarks',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '字典名称',
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
    field: 'name',
    label: '字典名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'type',
    label: '字典类型',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '字典排序',
    component: 'InputNumber',
    defaultValue: 100,
  },
  {
    field: 'state',
    label: '字典状态',
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
    label: '字典备注',
    field: 'remarks',
    component: 'InputTextArea',
  },
];
