<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增字典 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a href="javascript:void(1);" @click="dumpData(record)">{{ record.type }}</a>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '修改',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                label: '查看数据',
                onClick: dumpData.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DictDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteDict, getDictListByPage } from '/@/api/core/dict';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { useDrawer } from '/@/components/Drawer';
  import DictDrawer from './DictDrawer.vue';

  import { columns, searchFormSchema } from './dict.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'DictManagement',
    components: { BasicTable, DictDrawer, TableAction },
    setup() {
      const go = useGo();
      const { hasPermission } = usePermission();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, updateTableDataRecord, setLoading }] = useTable({
        title: '字典列表',
        api: getDictListByPage,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 300,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        try {
          setLoading(true);
          const id = record.id;
          const result = await deleteDict(id);
          if (result.code) {
            createMessage.error(result.message);
            return;
          }
          reload();
        } finally {
          setLoading(false);
        }
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
      }

      async function dumpData(record: Recordable) {
        go(`/middle/dict/data/${record.type}?dict_name=${record.name}`);
      }
      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        hasPermission,
        dumpData,
      };
    },
  });
</script>
