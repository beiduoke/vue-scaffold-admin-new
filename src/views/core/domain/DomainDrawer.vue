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
    <a-card title="菜单分配" :bordered="false">
      <BasicForm @register="registerMenuForm">
        <template #menu="{ model, field }">
          <BasicTree
            v-model:value="model[field]"
            :treeData="treeData"
            :fieldNames="{ title: 'title', key: 'id' }"
            checkable
            toolbar
            autoExpandParent
            defaultExpandAll
            clickRowToExpand
            defaultExpandLevel="10"
            title="菜单分配"
          />
        </template>
      </BasicForm>
    </a-card>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, menuFormSchema } from './domain.data';
  import { Card } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import {
    createDomain,
    getDomainListTree,
    getDomainMenuList,
    handleDomainMenu,
    updateDomain,
  } from '/@/api/core/domain';
  import { DomainListItem } from '/@/api/core/model/domainModel';
  import { BasicHandleResult, BasicDataResult } from '/@/api/core/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMenuListTree } from '/@/api/core/menu';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'DomainDrawer',
    components: { BasicDrawer, BasicForm, BasicTree, [Card.name]: Card },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);
      const record = ref<DomainListItem>();

      const [registerForm, { resetFields, updateSchema, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerMenuForm, { setFieldsValue: setMenuFieldsValue, validate: validateMenuForm }] =
        useForm({
          labelWidth: 90,
          baseColProps: { span: 24 },
          schemas: menuFormSchema,
          showActionButtonGroup: false,
        });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        record.value = undefined;
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          const menuTree = await getMenuListTree();
          treeData.value = menuTree as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          // 更新数据
          record.value = data.record;
          setFieldsValue({
            ...data.record,
          });
          // 更新分配菜单
          const { items } = await getDomainMenuList(data.record.id);
          setMenuFieldsValue({ menu: items.map((item) => item.id) });
        }

        const items = await getDomainListTree();
        updateSchema({
          field: 'parentId',
          componentProps: { treeData: [{ name: '顶级租户', id: 0 }, ...items] },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const [values, menuValues] = await Promise.all([validate(), validateMenuForm()]);
          // TODO custom api
          const id = (unref(record)?.id as string) ?? '';
          let result: BasicHandleResult<BasicDataResult>;
          if (id != '') {
            result = await updateDomain(id, values);
          } else {
            result = await createDomain(values);
          }
          if (result.code) {
            createMessage.error(result.message);
            return;
          }

          let menuIds: any[] = [];
          for (const iterator of menuValues.menu) {
            menuIds.push({ id: iterator });
          }

          const handleMenuResult = await handleDomainMenu(id, { menus: menuIds });
          if (handleMenuResult.code) {
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
        registerMenuForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  });
</script>
