<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    :isDetail="true"
    :showDetailBack="false"
    @ok="handleSubmit"
  >
    <a-card title="基础信息" :bordered="false">
      <BasicForm @register="registerForm" />
    </a-card>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './domain.data';
  import { Card } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree } from '/@/components/Tree';

  import {
    createDomain,
    getDomainListTree,
    getPackageListByPage,
    updateDomain,
  } from '/@/api/core/domain';
  import { BasicHandleResult, BasicDataResult } from '/@/api/core/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'DomainDrawer',
    // eslint-disable-next-line vue/no-unused-components
    components: { BasicDrawer, BasicForm, BasicTree, [Card.name]: Card },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { resetFields, updateSchema, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = data.isUpdate;
        if (unref(isUpdate)) {
          // 更新数据
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }

        const domains = await getDomainListTree();
        const packages = await getPackageListByPage({ nopaging: true });
        updateSchema([
          {
            field: 'parentId',
            componentProps: { treeData: [{ name: '顶级租户', id: 0 }, ...domains] },
          },
          {
            field: 'packageId',
            componentProps: { options: packages.items },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          // const [values] = await Promise.all([validate(), validateMenuForm()]);
          const values = await validate();
          // TODO custom api
          let result: BasicHandleResult<BasicDataResult>;
          if (rowId.value != '') {
            result = await updateDomain(rowId.value, values);
          } else {
            result = await createDomain(values);
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
      };
    },
  });
</script>
