<template>
  <PageWrapper class="virtual-scroll-demo">
    <Divider>基础滚动示例</Divider>
    <div class="virtual-scroll-demo-wrap">
      <VScroll :itemHeight="41" :items="data" :height="300" :width="300">
        <template #default="{ item }">
          <div class="virtual-scroll-demo__item">
            {{ item.title }}
          </div>
        </template>
      </VScroll>
    </div>

    <Divider>即使不可见，也预先加载50条数据，防止空白</Divider>
    <div class="virtual-scroll-demo-wrap">
      <VScroll :itemHeight="41" :items="data" :height="300" :width="300" :bench="50">
        <template #default="{ item }">
          <div class="virtual-scroll-demo__item">
            {{ item.title }}
          </div>
        </template>
      </VScroll>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { VScroll } from '@/components/VirtualScroll/index';
  import { Divider } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';

  const data = (() => {
    const arr: any[] = [];
    for (let index = 1; index < 20000; index++) {
      arr.push({
        title: '列表项' + index,
      });
    }
    return arr;
  })();
</script>
<style lang="less" scoped>
  .virtual-scroll-demo {
    &-wrap {
      display: flex;
      justify-content: center;
      margin: 0 30%;
      background-color: @component-background;
    }

    &__item {
      height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid @border-color-base;
      line-height: 40px;
    }
  }
</style>
