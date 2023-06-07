<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" @field-value-change="changeFieldValue" />
    <template v-if="getMenuType && false">
      <div>
        <a-space direction="vertical">
          <a-card title="菜单参数" :bordered="true">
            <menu-params-table ref="tableParamsRef" />
          </a-card>
          <a-card title="菜单按钮" :bordered="true">
            <menu-params-table ref="tableButtonsRef" />
          </a-card>
        </a-space>
      </div>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { buttonsColumns, formSchema, paramsColumns } from './menu.data';
  import { Input, Card, Space, Select } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createMenu, getMenuById, getMenuListTree, updateMenu } from '/@/api/core/menu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { MenuListItem } from '/@/api/core/model/menuModel';
  import { BasicHandleResult } from '/@/api/core/model/baseModel';
  import MenuParamsTable from './MenuParamsTable.vue';
  import { MenuType } from '/@/api/core/model/menuModel';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'MenuDrawer',
    components: {
      BasicForm,
      BasicDrawer,
      [Space.name]: Space,
      [Card.name]: Card,
      [Input.name]: Input,
      [Select.name]: Select,
      [Input.Group.name]: Input.Group,
      MenuParamsTable,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const isMenuType = ref(false);
      const record = ref<MenuListItem>();
      // 菜单参数
      const tableParamsRef = ref<{
        getDataSource: () => any;
        setColumns: (columns: any[]) => void;
      } | null>(null);

      // 菜单按钮
      const tableButtonsRef = ref<{
        getDataSource: () => any;
        setColumns: (columns: any[]) => void;
      } | null>(null);

      const [
        registerForm,
        { resetFields, getFieldsValue, setFieldsValue, updateSchema, validate },
      ] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        record.value = undefined;
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        const menuType = ref(getFieldsValue().type);
        if (unref(isUpdate)) {
          const item = await getMenuById(data.record.id);
          record.value = item;
          setFieldsValue({
            ...item,
          });
          menuType.value = item.type;
        }

        // 动态处理菜单类型显示
        await changeFieldValue('type', unref(menuType));

        // 设置父级菜单
        if (!!data.parentId) {
          setFieldsValue({ parentId: data.parentId });
        }

        // 菜单参数
        if (MenuType.MENU === menuType.value) {
          tableParamsRef.value?.setColumns(paramsColumns);
          const paramsData = tableParamsRef.value?.getDataSource();
          if (paramsData) {
            paramsData.splice(0, paramsData.length ?? 0);
            paramsData.push(...(unref(record)?.parameters || []));
          }
          // 菜单按钮
          tableButtonsRef.value?.setColumns(buttonsColumns);
          const buttonsData = tableButtonsRef.value?.getDataSource();
          if (buttonsData) {
            buttonsData.splice(0, buttonsData.length ?? 0);
            buttonsData.push(...(unref(record)?.buttons || []));
          }
        }

        const items = await getMenuListTree();
        updateSchema({
          field: 'parentId',
          componentProps: { treeData: [{ title: '顶级菜单', id: 0 }, ...items] },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));
      const getMenuType = computed(() => unref(isMenuType));

      async function changeFieldValue(key, val) {
        // 手动阻止
        if (key === 'type') {
          if ((val as MenuType) == MenuType.MENU) {
            isMenuType.value = true;
          } else {
            isMenuType.value = false;
          }
        }
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (tableParamsRef.value) {
            values.parameters = unref(tableParamsRef)?.getDataSource();
          }
          if (tableButtonsRef.value) {
            values.buttons = unref(tableButtonsRef)?.getDataSource();
          }
          switch (values.type as MenuType) {
            case MenuType.ABILITY:
              if (values.name === '') {
                values.name = values.title;
              }
              break;
            case MenuType.CATALOGUE:
              values.component = 'LAYOUT';
              break;
          }

          // TODO custom api
          let result: BasicHandleResult;
          const id = (unref(record)?.id as string) ?? '';
          if (id != '') {
            result = await updateMenu(id, values);
          } else {
            result = await createMenu(values);
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
        changeFieldValue,
        getMenuType,
        handleSubmit,
        tableParamsRef,
        tableButtonsRef,
      };
    },
  });
</script>

<style lang="less" scoped>
  .link-type-select {
    width: 20%;
  }

  .link-url-input {
    width: 70%;
  }
</style>
