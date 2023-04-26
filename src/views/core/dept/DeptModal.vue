<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';

  import { createDept, getDeptListTree, updateDept } from '/@/api/core/dept';
  import { BasicHandleResult, BasicDataResult } from '/@/api/core/model/baseModel';
  import { DeptListItem } from '/@/api/core/model/deptModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const record = ref<DeptListItem>();

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        record.value = undefined;
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
        record.value = data.record;
        const deptTree = await getDeptListTree();
        updateSchema({
          field: 'parentId',
          componentProps: { treeData: [{ name: '顶级部门', id: 0 }, ...deptTree] },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          let result: BasicHandleResult<BasicDataResult>;
          // TODO custom api
          const id = (unref(record)?.id as string) ?? '';
          if (id != '') {
            result = await updateDept(id, values);
          } else {
            result = await createDept(values);
          }
          if (result.code) {
            createMessage.error(result.message);
            return;
          }
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
