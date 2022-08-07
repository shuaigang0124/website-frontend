<template>
  <el-main id="dailySharing">
    <el-row class="mm" type="flex" justify="center">
      <el-col :span="17">
        <div class="dailySharing">
          <el-card>
            <div
              style="
                border-bottom: 1px solid gray;
                padding: 10px 0;
                font-size: 23px;
                display: inline-block;
                width: 100%;
              "
            >
              <el-button
                v-if="!loading"
                type="text"
                icon="el-icon-refresh-right"
                @click="refreshList"
              />
              <el-button v-else type="text" icon="el-icon-loading" />
              <el-button
                v-if="role === '管理员'"
                style="float: right"
                type="warning"
                icon="el-icon-camera-solid"
                round
                @click="release"
              >
                发布
              </el-button>
            </div>

            <div
              v-for="(dailySharing, index) in dailySharing"
              :key="dailySharing"
              style="margin: 30px 0"
            >
              <div style="margin-bottom: 10px; font-size: 16px; margin-top: 0">
                <strong>{{ dailySharing.title }}</strong>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-image
                    v-bind:src="dailySharing.img"
                    lazy
                    style="width: 100%; height: 100%; border-radius: 5px"
                  ></el-image>
                </el-col>
                <el-col :span="16">
                  <div style="color: #6b6b6b; margin-top: 20px; height: 50px">
                    {{ dailySharing.titleDescribe }}
                  </div>
                  <div style="height: 40px">
                    <el-tag>{{ dailySharing.tagName }}</el-tag>
                  </div>

                  <div style="height: 20px; margin-top: 10px">
                    <span style="color: #6b6b6b">
                      <i>作者： {{ dailySharing.userName }}</i>
                    </span>
                  </div>
                  <div style="height: 40px; margin-top: 10px">
                    <span style="color: #6b6b6b">
                      <i>阅读数：{{ dailySharing.readNum }}</i>
                      <i style="margin-left: 3%"
                        >点赞数：{{ dailySharing.clickNum }}</i
                      >
                      <i style="margin-left: 3%"
                        >发布时间：{{ dailySharing.gmtCreate }}</i
                      >
                    </span>
                    <b
                      v-if="dailySharing.userId === userId"
                      style="margin-left: 10px"
                    >
                      <el-button type="text" @click="update(dailySharing)"
                        ><i class="el-icon-edit"></i>编辑</el-button
                      >
                      <el-popconfirm
                        title="你确定删除吗？"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        @confirm="deleted(dailySharing.id)"
                        @cancel="cancelEvent"
                      >
                        <template #reference>
                          <el-button type="text"
                            ><i class="el-icon-delete"></i>删除</el-button
                          >
                        </template>
                      </el-popconfirm>
                    </b>
                    <b v-else>
                      <el-button type="text" />
                    </b>
                    <a @click="linkOpen3(index)">
                      <el-button
                        style="float: right"
                        type="warning"
                        size="small"
                        icon="el-icon-view"
                        round
                        >阅读文章
                      </el-button>
                    </a>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
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
              标签分类
            </div>
            <div style="margin-top: 10px">
              <b v-for="(tags, index) in tags" :key="tags">
                <el-tag style="margin: 5px" @click="findTagSharing(index)">{{
                  tags.name
                }}</el-tag>
              </b>
            </div>
          </el-card>
        </div>
        <div style="margin: 20px 0" align="center">
          <el-card
            style="
              background-color: white;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <div v-if="website.img">
              <el-row>
                <el-col :span="18" align="right">
                  <el-button size="mini" disabled>广告</el-button>
                </el-col>
                <el-col :span="6" align="center">
                  <el-button size="mini" @click="imgChange()"
                    >关闭广告</el-button
                  >
                </el-col>
              </el-row>
              <a @click="linkOpen(website.link)">
                <el-button style="width: 100%; margin-top: 10px">
                  <el-image
                    :src="website.advertising"
                    lazy
                    style="width: 100%"
                  ></el-image>
                </el-button>
              </a>
            </div>

            <div v-else style="">广告已关闭</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<style scoped>
.mm {
  margin: 90px 4% 180px 4%;
}

.dailySharing {
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>


<script lang="ts">
import post from ".././http/axios/index";
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { Base64 } from "js-base64";
import { ElLoading, ElMessage } from "element-plus";
import router from "@/router";
import store from "@/store";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    // 页面数据
    const state = reactive({
      loading: false,
      role: "",
      userId: "",
      img: "https://img.zcool.cn/community/0177965ad579eba8012040295d8025.png",
      tags: {
        id: "",
        name: "",
      },
      website: {
        img: "1",
        link: "https://www.jeep.com.cn/wrangler/jl/?mz_ca=2253619&mz_sp=7w3sT&mz_sb=1",
        advertising:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.58cdn.com.cn%2Fp1%2Fbig%2Fn_v2e1813b7c82444346ae52f36e2a2d469c.jpg&refer=http%3A%2F%2Fpic4.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634981915&t=0fafd7d8c17548c5ec832c42cd7722b3",
      },
      dailySharing: [
        {
          id: "",
          title: "",
          img: "",
          titleDescribe: "",
          tagName: "",
          userName: "",
          readNum: "",
          clickNum: "",
          gmtCreate: "",
        },
      ],
      index: 1,
      size: 10,
      tagId: 0,
      isLoading: false,
    });
    // 方法体
    const methods = {
      refreshList() {
        state.loading = true;
        request.getListSharing();
        // setTimeout(function () {
        //   if (state.loading) {
        //     state.loading = false;
        //   }
        // }, 5000);
      },
      // 新窗口打开发布
      release() {
        if (state.role === "管理员") {
          router.push({
            path: "/release",
          });
        } else if (state.role === "" || state.role === null) {
          ElMessage.warning("请登录后进行操作！");
        } else {
          ElMessage.warning("权限不足,请联系作者！");
        }
      },
      // 新窗口打开编辑
      update(dailySharing) {
        router.push({
          path: "/update",
        });
        store.commit("setDailySharing", dailySharing);
        // console.log(store.getters.dailySharing);
      },
      // 删除
      deleted(id) {
        request.deleted(id);
      },
      // 取消删除
      cancelEvent() {
        ElMessage.success("取消成功！");
      },
      //新窗口打开链接
      linkOpen(link) {
        window.open(link);
      },
      imgChange() {
        state.website.img = "";
      },
      linkOpen3(index) {
        let id = state.dailySharing[index].id;
        let readNum = state.dailySharing[index].readNum;
        request.updateByCondition(id, readNum);
      },
      findTagSharing(index) {
        state.tagId = state.tags[index].id;
        state.isLoading = false;
        state.index = 1;
        state.size = 10;
        request.getList(state.tags[index].id);
      },
      scroll() {
        window.onscroll = () => {
          // 距离底部200px时加载一次
          let bottomOfWindow =
            document.documentElement.offsetHeight -
              document.documentElement.scrollTop -
              window.innerHeight <=
            200;
          if (bottomOfWindow && state.isLoading == false) {
            state.isLoading = true;
            state.index += 1;
            // 请求体数据
            const data = {
              customData: {
                tagId: state.tagId,
                page: {
                  index: state.index,
                  size: state.size,
                },
              },
            };
            // post请求
            post("xx/xx/xx/xx", data).then((res: any) => {
              let { code, message, customData } = res;
              // console.log(res);
              if (message === "OK" && code === 200) {
                for (let i = 0; i < customData.resultList.length; i++) {
                  state.dailySharing.push(customData.resultList[i]);
                }
                nextTick(() => {
                  ElLoading.service({ fullscreen: true }).close();
                });
                if (customData.resultList.length === state.size) {
                  state.isLoading = false;
                }
              }
            });
          }
        };
      },
    };
    // 页面默认请求
    onMounted(() => {
      let role = localStorage.getItem("shuaigangQWQ");
      let ID = localStorage.getItem("shuaigangOVO");
      if (role) {
        state.role = Base64.decode(role);
      }
      if (ID) {
        state.userId = Base64.decode(ID);
      }
      request.getListSharing();
      request.getTags();
      window.addEventListener("scroll", methods.scroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", methods.scroll, false);
    });
    // 请求
    const request = {
      getListSharing() {
        // 请求体数据
        const data = {
          customData: {
            page: {
              index: 1,
              size: state.index * state.size,
            },
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          // console.log(res);
          if (code === 200) {
            state.dailySharing = customData.resultList;
            if (state.loading) {
              state.loading = false;
            }
          } else {
            ElMessage.error(message);
          }
        });
      },
      getList(tagId) {
        // 请求体数据
        const data = {
          customData: {
            tagId,
            page: {
              index: 1,
              size: 10,
            },
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          // console.log(res);
          if (code === 200) {
            state.dailySharing = customData.resultList;
          } else {
            ElMessage.error(message);
          }
        });
      },
      deleted(id) {
        // 请求体数据
        const data = {
          customData: {
            sharingId: id,
            deleted: 1,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message } = res;
            if (code === 200) {
              ElMessage.success(message);
              if (state.tagId === 0) {
                request.getListSharing();
              } else {
                request.getList(state.tagId);
              }
            } else {
              ElMessage.error("未知错误!");
            }
          }
        );
      },
      updateByCondition(id, readNum) {
        // 请求体数据
        const data = {
          customData: {
            sharingId: id,
            readNum: readNum,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code } = res;
            if (code === 200) {
              if (state.tagId === 0) {
                request.getListSharing();
              } else {
                request.getList(state.tagId);
              }
              let jump = router.resolve({
                path: "/detail",
                query: { id },
              });
              window.open(jump.href, "_blank");
            } else {
              ElMessage.error("未知错误!");
            }
          }
        );
      },
      getTags() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            state.tags = customData;
          }
        });
      },
    };
    return { ...methods, ...toRefs(state) };
  },
});
</script>