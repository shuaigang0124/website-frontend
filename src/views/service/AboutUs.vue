<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click="changeIndex('service')"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>关于本站</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <!-- <div align="center">
        <el-card
          shadow="always"
          style="
            background-color: #e1f3d8;
            color: #409eff;
            width: 30%;
            margin-top: 30px;
          "
        >
          编辑站长信息
        </el-card>
      </div> -->

    <TEditor ref="editRef" :value="author.content" style="margin-top: 30px" />

    <div style="padding: 20px" align="center">
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </div>
</template>

<style>
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import TEditor from "../../components/txt/TEditor.vue";
import post from "../.././http/axios/index";
import { ElMessage } from "element-plus";
export default defineComponent({
  // props: {
  //   name: {
  //     type: String,  //数据类型
  //     required: true,  //必传
  //     default: "",  //默认值
  //   }
  // },
  components: {
    TEditor,
  },
  setup() {
    const editRef = ref();
    const state = reactive({
      id: "",
      author: {
        content: ``,
      },
    });
    const methods = {
      save() {
        // window.location.reload();
        const form = editRef;
        // console.log(form.value.contentValue);
        let content = form.value.contentValue;
        const data = {
          customData: {
            id: state.id,
            content,
          },
        };
        post("/xxx/xxx/xxx/xxx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200 && message !== "未认证") {
            ElMessage.success(message);
          } else {
            ElMessage.info(message);
          }
        });
      },
    };
    onMounted(() => {
      request.getAuthorContent();
    });
    const request = {
      getAuthorContent() {
        const data = {
          customData: {},
        };
        post("/xxx/xxx/xxx/xxx", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          state.author.content = customData[0].content;
          state.id = customData[0].id;
        });
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      editRef,
    };
  },
});
</script>