<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userFormSchema } from './user.data';
  import { createUser, updateUser } from '/@/api/core/user';
  import { getDeptListTree } from '/@/api/core/dept';
  import { getAllRoleList } from '/@/api/core/role';
  import { getAllPostList } from '/@/api/core/post';
  import { BasicDataResult, BasicHandleResult } from '/@/api/core/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
import { RoleListItem } from '/@/api/core/model/roleModel';
import { PostListItem } from '/@/api/core/model/postModel';
import { formatToDate } from '/@/utils/dateUtil';
import { DeptListItem } from '/@/api/core/model/deptModel';
  const { createMessage } = useMessage();

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const deptTreeData = ref<DeptListItem[]>([]);
      const rolesData = ref<RoleListItem[]>([]);
      const postsData = ref<PostListItem[]>([]);

      const [registerForm, { setFieldsValue, updateSchema,removeSchemaByField, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { lg: 12, md: 24 },
        schemas: userFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(deptTreeData).length === 0) {
          deptTreeData.value = await getDeptListTree();
        }
        if (unref(rolesData).length === 0) {
          rolesData.value = await getAllRoleList();
        }
        if (unref(postsData).length === 0) {
          postsData.value = await getAllPostList();
        }

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }
        updateSchema([
          {
            field: 'password',
            show: !unref(isUpdate),
            required: !unref(isUpdate)
          },
          {
            field: 'deptId',
            componentProps: { treeData: deptTreeData },
          },
          {
            field: 'roleIds',
            componentProps: { options: rolesData },
          },
          {
            field: 'postIds',
            componentProps: { options: postsData },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));
      
      /**
       * 展开部门所有节点
       * @param depts 
       */
      function expandDeptTree(depts: DeptListItem[] = []) :DeptListItem[] {
        const result: DeptListItem[] = [];
        for (const iterator of depts) {
          if (iterator.children.length > 0){
            result.push(...expandDeptTree(iterator.children));
          }
          result.push(iterator);
        }
        return result
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          console.log(values)
          // TODO custom api
          let result: BasicHandleResult<BasicDataResult>;
          if(values.birthday) {
            values.birthday = formatToDate(values.birthday)
          }
          if (rowId.value != '') {
            result = await updateUser(rowId.value, values);
            // 处理数据回传
            const roles = ref<RoleListItem[]>([])
            for (const iterator of values.roleIds) {
              roles.value.push(rolesData.value.find(v => v.id == iterator) as RoleListItem)
            }
            values.dept = (expandDeptTree(deptTreeData.value) as DeptListItem[]) .find(v => v.id === values.deptId)
            values.roles = roles.value
          } else {
            result = await createUser(values);
          }
          if (result.code) {
            createMessage.error(result.message);
            return;
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
