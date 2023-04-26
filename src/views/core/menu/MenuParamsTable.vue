<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd"> 新增 </a-button>
  </div>
</template>
<script lang="ts">
  import { Button } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  export default defineComponent({
    name: 'MenuParamsTable',
    components: { BasicTable, TableAction, [Button.name]: Button },
    setup() {
      const [registerTable, { getDataSource, setColumns, getColumns }] = useTable({
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
        pagination: false,
      });

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
        }
      }

      function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true);
      }

      function handelDelete(record: EditRecordRow) {
        console.log(record);
        const data = getDataSource();
        const index = data.findIndex((item) => item.key === record.key);
        data.splice(index, 1);
        // record.onEdit?.(false, true);
      }

      function handleAdd() {
        const data = getDataSource();
        const addRow: EditRecordRow = {
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        };
        getColumns().forEach((val) => {
          const { dataIndex } = val;
          if (dataIndex != 'action') {
            const key = dataIndex as string;
            addRow[key] = '';
          }
        });
        data.push(addRow);
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '删除',
              onClick: handelDelete.bind(null, record, column),
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      return {
        registerTable,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        setColumns,
      };
    },
  });
</script>
