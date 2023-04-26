<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
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
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { createRole, getRoleMenuList, handleRoleMenu, updateRole } from '/@/api/core/role';
  import { RoleListItem } from '/@/api/core/model/roleModel';
  import { BasicHandleResult, BasicDataResult } from '/@/api/core/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getUserMenuListTree } from '/@/api/core/user';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const record = ref<RoleListItem>();

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        record.value = undefined;
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const items = await getUserMenuListTree();
          treeData.value = items as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          const { items } = await getRoleMenuList(data.record.id);
          data.record.menu = items.map((item) => item.id);
          record.value = data.record;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          const menus = values.menu as string[];
          delete values['menu'];
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          let id = (unref(record)?.id as string) ?? '';
          let result: BasicHandleResult<BasicDataResult>;
          if (id != '') {
            result = await updateRole(id, values);
          } else {
            result = await createRole(values);
          }
          if (result.code) {
            createMessage.error(result.message);
            return;
          }
          let menuIds: any[] = [];
          for (const iterator of menus) {
            menuIds.push({ id: iterator });
          }

          const handleMenuResult = await handleRoleMenu(id ?? result.result?.id, {
            menus: menuIds,
          });
          if (!handleMenuResult.code) {
            createMessage.error(handleMenuResult.message);
          }

          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  });
</script>
