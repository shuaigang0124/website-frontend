<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import router from "./router";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    // 页面数据
    const state = reactive({});
    // 方法体
    const methods = {
      _isMobile() {
        let flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
        return flag;
      },
    };
    // 页面默认请求
    onMounted(() => {
      if (methods._isMobile()) {
        router.push({
          path: "/500",
        });
      } 
    });
    // 请求
    const request = {};
    return { ...methods, ...toRefs(state) };
  },
});
</script>
<style>
</style>