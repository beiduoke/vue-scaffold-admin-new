import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { getAllDictList, setDictDataState } from '/@/api/core/dict';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { State } from '/@/api/core/model/baseModel';

export const columns: BasicColumn[] = [
  {
    title: '字典标签',
    dataIndex: 'label',
    width: 200,
  },
  {
    title: '字典键值',
    dataIndex: 'value',
    width: 200,
  },
  {
    title: '字典状态',
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
          setDictDataState(record.id, newStatus)
            .then(() => {
              record.state = newStatus;
              createMessage.success(`字典数据状态修改成功`);
            })
            .catch(() => {
              createMessage.error('字典数据状态修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '字典排序',
    dataIndex: 'sort',
    width: 120,
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
    field: 'label',
    label: '字典标签',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'dictType',
    label: '字典类型',
    component: 'ApiSelect',
    componentProps: {
      api: getAllDictList,
      labelField: 'name',
      valueField: 'type',
    },
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
    field: 'dictType',
    label: '字典类型',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getAllDictList,
      labelField: 'name',
      valueField: 'type',
    },
  },
  {
    field: 'label',
    label: '字典标签',
    required: true,
    component: 'Input',
  },
  {
    field: 'value',
    label: '字典键值',
    required: true,
    component: 'Input',
  },
  {
    field: 'colorType',
    label: '颜色类型',
    component: 'Input',
  },
  {
    field: 'cssClass',
    label: '样式Class',
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
