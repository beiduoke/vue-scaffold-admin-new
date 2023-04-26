import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setPostState } from '/@/api/core/post';
import { useMessage } from '/@/hooks/web/useMessage';
import { formatToDateTime } from '/@/utils/dateUtil';
import { PostState } from '/@/api/core/model/postModel';

export const columns: BasicColumn[] = [
  {
    title: '岗位名称',
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
        checked: record.state === PostState.ACTIVE,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? PostState.ACTIVE : PostState.INACTIVE;
          const { createMessage } = useMessage();
          setPostState(record.id, newStatus)
            .then(() => {
              record.state = newStatus;
              createMessage.success(`已成功修改岗位状态`);
            })
            .catch(() => {
              createMessage.error('修改岗位状态失败');
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
    label: '岗位名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'state',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: PostState.ACTIVE },
        { label: '停用', value: PostState.INACTIVE },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '岗位名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '岗位排序',
    defaultValue: 100,
    required: true,
    component: 'InputNumber',
  },
  {
    field: 'state',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: PostState.ACTIVE,
    componentProps: {
      options: [
        { label: '启用', value: PostState.ACTIVE },
        { label: '停用', value: PostState.INACTIVE },
      ],
    },
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
  },
];
