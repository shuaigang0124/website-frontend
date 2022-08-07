<template>
  <div>
    <div class="app-container">
      <div class="app-content">
        <h3 style="color: red; margin-top: 40vh"><i>500 Internal Server Error</i></h3>
        <h2 style="color: #606266">该设备暂不支持！</h2>
        <!-- <h3 style="color: #909399; font-size: 14px">
          当你看到这个页面，表示服务器内部错误，此网站可能遇到技术问题，无法执行您的请求，请稍后重试或联系站长进行处理，感谢您的支持！
        </h3> -->
        <h3 style="color: #909399; font-size: 14px;margin: 0 30px 0 30px">
          当你看到这个页面，表示该网站暂不支持移动端浏览器访问，请使用PC浏览器访问，感谢您的支持！
        </h3>
      </div>
    </div>
  </div>
</template>

<script lang = "ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
  components: {},
  setup() {
    const state = reactive({});

    const methods = {};

    onMounted(() => {});
    const request = {};
    return {
      ...toRefs(state),
      ...methods,
    };
  },
});
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100vw;
}

.app-content {
  text-align: center;
  background-image: url(../assets/520.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 100vw;
}
</style>
