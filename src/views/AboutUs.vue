<template>
  <el-main id="aboutUs">
    <el-row type="flex" justify="center" class="aboutUs">
      <el-col :span="17">
        <el-card>
          <div style="text-align: center">
            <div style="font-size: 22px">作者留言</div>
          </div>
          <!--                    分割线-->
          <div
            style="height: 1px; margin: 10px 0; background-color: #ccc"
          ></div>

          <div
            style="
              margin-top: 35px;
              margin-left: 60px;
              margin-right: 60px;
              color: #888;
            "
            class="view-notice-body"
            align="left"
            v-html="author.content"
          ></div>
        </el-card>
        <el-card align="center">
          <el-button
            type="success"
            @click="changeClick"
            round
            v-if="clickState == 0"
            >点赞（{{ author.click }}）</el-button
          >
          <el-button type="warning" @click="changeClick" round v-else
            >取消（{{ author.click }}）</el-button
          >
        </el-card>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="6">
        <div>
          <el-card style="background-color: #4e4e4e; color: #e3e3e3">
            <div
              style="
                border-bottom: 1px solid orangered;
                padding-bottom: 10px;
                font-size: 20px;
              "
            >
              站长简介
            </div>
            <div>
              <div style="color: #f0f8ff; margin: 10px 0; font-size: 14px">
                <i class="el-icon-s-custom"></i>
                <span>职业：Java开发工程师</span>
              </div>
              <div style="color: #f0f8ff; margin: 10px 0; font-size: 14px">
                <i class="el-icon-map-location"></i>
                <span>地址：重庆市</span>
              </div>
              <div style="color: #f0f8ff; margin: 10px 0; font-size: 14px">
                <i class="el-icon-medal"></i>
                <span>微博：电竞选手稳如狗</span>
              </div>
              <div style="color: #f0f8ff; margin: 10px 0; font-size: 14px">
                <i class="el-icon-trophy"></i>
                <span>QQ：1491900793</span>
              </div>
              <div style="color: #f0f8ff; margin: 10px 0; font-size: 14px">
                <i class="el-icon-message"></i>
                <span>e-mail：1491900793@qq.com</span>
              </div>

              <el-popover placement="top-start" :width="20" trigger="hover">
                <img src="../assets/qqCode.png" style="width: 87%" />
                <template #reference>
                  <img
                    src="../assets/qq.jpg"
                    style="
                      width: 15%;
                      border-radius: 50%;
                      margin-left: 10px;
                      margin-top: 20px;
                    "
                  />
                </template>
              </el-popover>
              <el-popover placement="top-start" :width="20" trigger="hover">
                <img src="../assets/wb.jpg" style="width: 100%" />
                <template #reference>
                  <img
                    src="../assets/weibo.jpg"
                    style="width: 15%; border-radius: 50%; margin-left: 20px"
                  />
                </template>
              </el-popover>
            </div>
          </el-card>
        </div>
        <div style="margin: 20px 0">
          <el-card>
            <div
              style="
                border-bottom: 1px solid gray;
                padding-bottom: 10px;
                font-size: 20px;
              "
            >
              万事顺遂
            </div>
            <div style="margin-top: 10px">
              <!--                                  <a :href="'http://localhost:8888/page/front/blog.html?tag=' + item.name" v-for="item in tags">
                                                                  <el-tag style="margin: 5px">{{item.name}}</el-tag>
                                                              </a>-->
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang = "ts">
import { ElMessage } from "element-plus";
import { Base64 } from "js-base64";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import post from "../http/axios/index";
export default defineComponent({
  components: {},
  setup() {
    const editRef = ref();
    const state = reactive({
      clickState: 0,
      userId: "",
      dialogVisible: false,
      author: {
        id: "",
        content: "",
        click: 0,
      },
    });

    const methods = {
      changeClick() {
        let id = state.author.id;
        let click = state.author.click;
        if (state.userId === "" || state.userId === null) {
          ElMessage.warning("请先登录后进行操作");
        } else {
          // 后端运算
          // click += 1;
          request.update(id, click);
        }
      },
    };

    onMounted(() => {
      request.getList();
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId) {
        state.userId = Base64.decode(userId);
      }
    });
    const request = {
      getList() {
        const data = {
          customData: {},
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { customData } = res;
          state.author.content = customData[0].content;
          state.author.id = customData[0].id;
          state.author.click = customData[0].click;
          request.findKudos();
        });
      },
      findKudos() {
        const data = {
          customData: {
            userId: state.userId,
            serviceId: state.author.id.toString(),
          },
        };
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { customData } = res;
            state.clickState = customData;
            console.log(state.clickState);
          }
        );
      },
      update(id, click) {
        const data = {
          customData: {
            id,
            click,
            userId: state.userId,
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            state.clickState = 1;
            request.getList();
          } else {
            ElMessage.warning(message);
            state.clickState = 0;
            request.getList();
          }
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

<style>
.aboutUs {
  margin: 90px 4% 180px 4%;
}

.view-notice-body {
  word-break: break-all;
  word-wrap: break-word;
  text-indent: 32px;
}
</style>
