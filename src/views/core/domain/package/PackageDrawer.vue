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
  import { formSchema } from './package.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createPackage, updatePackage } from '/@/api/core/domain';
  import { BasicHandleResult, BasicDataResult } from '/@/api/core/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMenuListTree } from '/@/api/core/menu';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'PackageDrawer',
    components: { BasicDrawer, BasicTree, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<any>([]);
      const rowId = ref<string>('');

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        rowId.value = data.record.id;
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const items = await getMenuListTree();
          treeData.value = items as any as TreeItem[];
        }
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (rowId.value ? '新增套餐' : '编辑套餐'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          let result: BasicHandleResult<BasicDataResult>;
          if (rowId.value != '') {
            result = await updatePackage(rowId.value, values);
          } else {
            result = await createPackage(values);
          }
          if (result.code) {
            createMessage.error(result.message);
            return;
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
