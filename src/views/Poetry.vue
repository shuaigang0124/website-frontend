<template>
  <el-main id="poetry">
    <div class="poetry">
      <div style="text-align: center; letter-spacing: 5px; text-indent: 5px">
        <div>{{ data.origin.title }}</div>
        <div style="margin-top: 15px; font-size: 12px">
          【{{ data.origin.dynasty }}】{{ data.origin.author }}
        </div>
        <div
          style="margin-top: 10px; margin-bottom: 10px; margin-right: 5vw"
          align="right"
        >
          <el-button
            type="primary"
            size="small"
            round
            @click="hys"
            v-bind:disabled="dis"
            >换一首</el-button
          >
        </div>

        <div
          v-for="(content, index) in data.origin.content"
          :key="content"
          :style="{
            color:
              data.origin.content[index] === data.content ? 'blue' : 'null',
          }"
        >
          {{ data.origin.content[index] }}
        </div>

        <div
          style="margin-top: 60px; margin-bottom: 10px; margin-left: 12vw"
          align="left"
        >
          <b>诗词解析：</b>
        </div>
        <div v-if="data.origin.translate">
          <div
            align="left"
            style="margin-left: 15vw"
            v-for="(translate, index) in data.origin.translate"
            :key="translate"
          >
            {{ data.origin.translate[index] }}
          </div>
        </div>
        <div v-else align="left" style="margin-left: 15vw">
          -----暂无解析-----
        </div>
      </div>
    </div>
  </el-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import post from "../http/axios/index";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const jinrishici = require("jinrishici");
    const state = reactive({
      personal: [
        {
          remark: "",
          address: "",
        },
      ],
      website: {
        img: "1",
        link: "https://www.jeep.com.cn/wrangler/jl/?mz_ca=2253619&mz_sp=7w3sT&mz_sb=1",
        advertising:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.58cdn.com.cn%2Fp1%2Fbig%2Fn_v2e1813b7c82444346ae52f36e2a2d469c.jpg&refer=http%3A%2F%2Fpic4.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634981915&t=0fafd7d8c17548c5ec832c42cd7722b3",
      },
      data: {
        // 推荐诗句
        content: "",
        // 流行程度
        popularity: 0,
        // 源诗信息
        origin: {
          // 题目
          title: "",
          // 年代
          dynasty: "",
          // 作者
          author: "",
          // 诗词内容
          content: [],
          // 整诗翻译
          translate: [],
        },
        // 相关标签
        matchTags: [],
      },
      dis: false,
    });
    const methods = {
      linkOpen(link) {
        window.open(link); //新窗口打开链接
      },
      imgChange() {
        state.website.img = "";
      },
      loadSentence() {
        jinrishici.load(
          (result) => {
            // if (result.data.origin.content[19]) {
            //   methods.loadSentence();
            // }
            state.data = result.data;
            state.dis = true;
            setTimeout(() => {
              state.dis = false;
            }, 1500);
          },
          (err) => {
            console.log("test");
          }
        );
      },
      hys() {
        methods.loadSentence();
      },
    };
    onMounted(() => {
      methods.loadSentence();
    });
    const request = {};
    return { ...methods, ...toRefs(state) };
  },
});
</script>

<style>
.poetry {
  margin: 90px 4% 180px 4%;
}
</style>
