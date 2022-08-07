<template>
  <div>我们毕业啦</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    // 页面数据
    const state = reactive({});
    // 方法体
    const methods = {};
    // 页面默认请求
    onMounted(() => {
    });
    
    return { ...methods, ...toRefs(state) };
  },
});
</script>
<style>
</style>