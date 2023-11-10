<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增租户 </a-button>
        <a-button type="primary" @click="packageManagement"> 套餐管理 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action' && record.id > 0">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                label: '权限',
                onClick: handleEditMenu.bind(null, record),
                auth: 'system:domain:menu:handle',
              },
              {
                icon: 'ant-design:delete-outlined',
                label: '删除',
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
    <DomainDrawer @register="registerDrawer" @success="handleSuccess" />
    <DomainMenuModal @register="registerMenuModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteDomain, getDomainListByPage } from '/@/api/core/domain';

  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import DomainDrawer from './DomainDrawer.vue';
  import DomainMenuModal from './DomainMenuModal.vue';

  import { columns, searchFormSchema } from './domain.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';

  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'DomainManagement',
    components: { BasicTable, DomainDrawer, TableAction, DomainMenuModal },
    setup() {
      const go = useGo();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerMenuModal, { openModal: openMenuModal }] = useModal();
      const [registerTable, { reload, expandAll, setLoading }] = useTable({
        title: '租户列表',
        api: (arg) => getDomainListByPage(arg),
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: false,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        canResize: false,
        actionColumn: {
          width: 220,
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
          const result = await deleteDomain(id);
          if (result.code) {
            createMessage.error(result.message);
            return;
          }
          reload();
        } finally {
          setLoading(false);
        }
      }

      function handleEditMenu(record: Recordable) {
        openMenuModal(true, { record });
      }

      function handleSuccess() {
        reload();
      }

      function packageManagement() {
        go({ name: 'DomainPackageManagement' });
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }
      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleEditMenu,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        registerMenuModal,
        packageManagement,
      };
    },
  });
</script>
