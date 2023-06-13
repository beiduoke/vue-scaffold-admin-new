<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" >
      <template #deptCustoms="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          :toolbar="true"
          autoExpandParent
          defaultExpandAll
          clickRowToExpand
          defaultExpandLevel="10"
          title="自定义部门权限"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { dataFormSchema } from './role.data';
import { BasicTree, TreeItem } from '/@/components/Tree';
import { getDeptListTree } from '/@/api/core/dept';
import { getRoleDataScope, handleRoleDataScope } from '/@/api/core/role';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'RoleDataModal',
    components: { BasicModal,BasicTree, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref<string>('');
      const treeData = ref<any>([]);

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { lg: 24, md: 24 },
        schemas: dataFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        rowId.value = data.record.id;

        
        if (unref(treeData).length === 0) {
          const items = await getDeptListTree();
          treeData.value = items as any as TreeItem[];
        }

        
        // 更新分配数据权限
        const { scope, deptCustoms } = await getRoleDataScope(data.record.id);
        setFieldsValue({
          name: data.record.name,
          scope: scope,
          deptCustoms: deptCustoms,
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增数据权限' : '编辑数据权限'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          const handleDataScopeResult = await handleRoleDataScope(rowId.value, {
            scope: values.scope,
            deptCustoms: values.deptCustoms || []
          });
          if (handleDataScopeResult.code) {
            createMessage.error(handleDataScopeResult.message);
          } else {
            createMessage.success(handleDataScopeResult.message);
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit,treeData };
    },
  });
</script>
