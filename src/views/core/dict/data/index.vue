<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="dashed" @click="returnList"> 返回字典列表 </a-button>
        <a-button type="primary" @click="handleCreate"> 新增字典数据 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '修改',
                onClick: handleEdit.bind(null, record),
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
  import { defineComponent, ref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteDictData, getDictDataListByPage } from '/@/api/core/dict';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { useDrawer } from '/@/components/Drawer';
  import DictDrawer from './DataDrawer.vue';

  import { columns, searchFormSchema } from './data.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'DictDataManagement',
    components: { BasicTable, DictDrawer, TableAction },
    setup() {
      const go = useGo();
      const route = useRoute();
      const routeParams = ref({})
      const dictType = ref(route.params?.dict_type)
      if (dictType.value) {
        routeParams.value = {dictType: dictType.value}
      }
      const { hasPermission } = usePermission();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload,updateTableDataRecord, setLoading }] = useTable({
        title: '字典数据列表',
        api: getDictDataListByPage,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          mergeDynamicData: routeParams.value
        },
        searchInfo: routeParams.value,
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

      function returnList() {
        go("/middle/dict")
      }

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
          const result = await deleteDictData(id);
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

      return {
        registerTable,
        registerDrawer,
        returnList,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        hasPermission,
      };
    },
  });
</script>

function useRoute() {
  throw new Error('Function not implemented.');
}
