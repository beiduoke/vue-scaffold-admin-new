<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'title', key: 'id' }"
          checkable
          :toolbar="true"
          autoExpandParent
          defaultExpandAll
          clickRowToExpand
          defaultExpandLevel="10"
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { menuFormSchema } from './role.data';
  import { getUserMenuListTree } from '/@/api/core/user';
  import { getRoleMenuList, handleRoleMenu } from '/@/api/core/role';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'RoleMenuModal',
    components: { BasicModal, BasicTree, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const rowId = ref<string>('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { lg: 24, md: 24 },
        schemas: menuFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        rowId.value = data.record.id;
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const items = await getUserMenuListTree();
          treeData.value = items as any as TreeItem[];
        }
        
        // 更新分配菜单
        const { items } = await getRoleMenuList(data.record.id);
        setFieldsValue({
          name: data.record.name,
          menu: items.map((item: { id: any; }) => item.id),
        });
      });

      const getTitle = computed(() => ('编辑菜单权限'));

      async function handleSubmit() {
        try {
          const values = await validate();
          const menus = values.menu as string[];
          setModalProps({ confirmLoading: true });
          // TODO custom api
          let id = unref(rowId) as string;
          console.log(values);
          let menuIds: string[] = [];
          for (const iterator of menus) {
            menuIds.push(iterator);
          }

          const handleMenuResult = await handleRoleMenu(id, {
            menus: menuIds,
          });
          if (!handleMenuResult.code) {
            createMessage.error(handleMenuResult.message);
          }
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, treeData};
    },
  });
</script>
