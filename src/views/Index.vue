<template>
  <el-config-provider :locale="locale">
    <app />
  </el-config-provider>
  <div id="index" v-cloak>
    <el-container>
      <el-header id="header">
        <el-row
          class="flex-warp"
          style="flex-wrap: wrap; flex-direction: row"
          type="flex"
          justify="end"
          align="middle"
        >
          <el-col :span="5">
            <div style="color: black; text-align: center; font-size: 24px">
              <i>隔江明月照莲华</i>
            </div>
          </el-col>
          <el-col :span="16">
            <el-menu
              router
              :default-active="$route.path"
              mode="horizontal"
              class="el-menu-demo"
              text-color="black"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="/index/homePage">主页</el-menu-item>
              <el-menu-item index="/index/dailySharing">博文分享</el-menu-item>
              <el-menu-item index="/index/poetry">今日诗词</el-menu-item>
              <el-menu-item index="/index/message">留言</el-menu-item>
              <el-menu-item index="/index/updateLog">更新日志</el-menu-item>
              <el-menu-item index="/index/aboutUs">关于本站</el-menu-item>
              <el-menu-item index="/index/mall">积分商城</el-menu-item>
              <el-menu-item index="/index/travel"
                ><i style="color: green">Travel</i></el-menu-item
              >
            </el-menu>
          </el-col>
          <el-col :span="3">
            <div v-if="user.id" class="el-user-welcome">
              <el-avatar :size="30" :src="user.avatar" />
              <!--el-link :underline="false" -->
              <el-link
                @click="linkOpen2"
                style="
                  margin-left: 10px;
                  margin-right: 10px;
                  color: blue;
                  font-size: small;
                  display: -webkit-box;
                  overflow: hidden;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                "
              >
                {{ user.userName }}
              </el-link>
              <el-button size="mini" @click="logout">退出</el-button>
            </div>
            <div v-else>
              <a href="/login">
                <el-button size="mini" type="primary">登录</el-button>
              </a>
              <a href="/register" style="margin-left: 10px">
                <el-button size="mini">注册</el-button>
              </a>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main">
        <el-row class="content" type="flex" justify="center" :gutter="20">
          <el-col :span="24" class="homePage">
            <router-view />
            <el-backtop />
          </el-col>
        </el-row>
        <div align="center" class="footer">
          <div class="mid_cont">
            <el-divider></el-divider>
            <div class="top_word">
              <div class="left_word" align="left">
                <el-row>
                  <el-col :span="6" align="right">
                    <b>网站说明：</b>
                  </el-col>
                  <el-col :span="18" align="left">
                    <i style="font-size: 14px">
                      网站保存收集的信息不会另做它用，网站发布内容发生违规与作者概不相关，请大家自觉遵守网络法律法规，最终解释权归网站作者所有。
                    </i>
                  </el-col>
                </el-row>
              </div>
              <div class="right_word">
                <el-row style="width: 80%">
                  <el-col :span="4" align="right">
                    <b>友情链接：</b>
                  </el-col>
                  <el-col :span="20" align="left">
                    <el-link
                      style="margin-left: 20px"
                      v-for="linkData in linkData"
                      :key="linkData"
                      :href="linkData.url"
                      target="_blank"
                      :underline="false"
                    >
                      {{ linkData.name }}
                    </el-link>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="bot_word">
              <el-link style="font-size: 12px">------------------</el-link>
              <el-link
                :underline="false"
                @click="qq"
                style="font-size: 14px; margin-left: 20px"
                >QQ：1491900793</el-link
              >
              <el-link style="font-size: 20px; margin-left: 20px">|</el-link>
              <el-link
                :underline="false"
                @click="weibo"
                style="font-size: 14px; margin-left: 20px"
                >微博：电竞选手稳如狗</el-link
              >
              <el-link style="font-size: 20px; margin-left: 20px">|</el-link>
              <el-link
                :underline="false"
                @click="record"
                style="font-size: 14px; margin-left: 20px"
                >帅刚© 2021-2022：渝ICP备2021011002号</el-link
              >
              <el-link style="font-size: 12px; margin-left: 20px"
                >-----------------</el-link
              >
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script lang="ts">
import post from "@/http/axios";
import { ElConfigProvider, ElMessage } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { Base64 } from "js-base64";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
  name: "HomePage",
  components: {
    ElConfigProvider,
  },
  props: {},
  setup() {
    // 页面数据
    const state = reactive({
      foot: {
        WBlink: "https://www.weibo.com/u/6120829674",
        QQlink: "tencent://QQInterLive/?Cmd=2&Uin=1491900793",
        recordlink: "https://beian.miit.gov.cn",
      },
      linkData: [
        {
          name: "",
          url: "",
        },
      ],
      website: {
        link: "/userData",
      },
      user: {
        id: "",
        userName: "",
        avatar: "",
      },
    });
    // 方法体
    const methods = {
      logout() {
        request.logout();
        state.user.id = "";
        localStorage.setItem("token", "");
        localStorage.setItem("shuaigangOVO", "");
        localStorage.setItem("shuaigangQWQ", "");
        window.location.reload();
      },
      linkOpen2() {
        window.open("/userData");
      },
      weibo() {
        window.open(state.foot.WBlink);
      },
      qq() {
        window.open(state.foot.QQlink);
      },
      record() {
        window.open(state.foot.recordlink);
      },
      linkEvent(linkData, index) {
        // console.log(linkData[index].link);
        window.open(linkData[index].link);
      },
    };
    // 页面默认请求
    onMounted(() => {
      window.addEventListener("scroll", function (event) {
        var scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop;
        var element = document.querySelectorAll(".el-header");
        var aa = <HTMLElement>element[0].childNodes[1];
        if (scrollTop > 10 && scrollTop <= 15) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.2)";
        } else if (scrollTop > 7.5 && scrollTop <= 15) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.3)";
        } else if (scrollTop > 15 && scrollTop <= 22.5) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.4)";
        } else if (scrollTop > 22.5 && scrollTop <= 30) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.5)";
        } else if (scrollTop > 30 && scrollTop <= 37.5) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.6)";
        } else if (scrollTop > 37.5 && scrollTop <= 45) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.7)";
        } else if (scrollTop > 45 && scrollTop <= 52.5) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.8)";
        } else if (scrollTop > 52.5 && scrollTop <= 60) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.9)";
        } else if (scrollTop > 60) {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 1)";
        } else {
          //改变背景颜色
          aa.style.backgroundColor = "rgba(119, 136, 153, 0.1)";
        }
      });
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId === "" || userId === null) {
      } else {
        let id = Base64.decode(userId);
        request.getList(id);
        request.generateToken(id);
      }
      request.getLink();
    });
    // 请求
    const request = {
      getList(id) {
        // 请求体数据
        const data = {
          customData: {
            userId: id,
          },
        };
        // post请求
        post("/shuaigang/v1/user/getUserDetails", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.user = customData;
          }
        });
      },
      getLink() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("/shuaigang/v1/link/getLink", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.linkData = customData;
            // console.log(state.linkData);
          }
        });
      },
      generateToken(id) {
        // 请求体数据
        const data = {
          customData: {
            userId: id,
          },
        };
        // post请求
        post("/authentication/generateToken", data).then((res: any) => {
          let { code, customData } = res;
          if (code === 200) {
            localStorage.setItem("token", customData.Authorization);
            localStorage.setItem("shuaigangOVO", customData.userId);
            localStorage.setItem("shuaigangQWQ", customData.role);
          }
        });
      },
      logout() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.user.id,
          },
        };
        // post请求
        post("/authentication/logout", data).then((res: any) => {
          // console.log(res);
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), locale: zhCn };
  },
});
</script>

<style scoped>
.el-header {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  --el-header-padding: 0;
  background-color: rgba(119, 136, 153, 0.1);
}

.el-menu {
  --el-menu-background-color: none;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.el-main {
  background-color: #ebf7f4;
  /* overflow-x: hidden;
  overflow-y: scroll; */
  --el-main-padding: 0 !important;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 140px;
  background-color: #ebf7f4;
}

.el-main::-webkit-scrollbar {
  display: none;
}

.main {
  /* 100vh-121px */
  min-height: calc(100vh);
  position: relative;
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
  background-color: rgba(119, 136, 153, 0);
}

.el-card {
  width: 100%;
}

.flex-warp {
  flex-wrap: wrap;
}

.el-user-welcome {
  width: 100%;
  display: flex;
  align-items: center;
}

.mid_cont {
  position: relative;
}

.top_word {
  display: flex;
  height: 43%;
  margin-bottom: 15px;
}

.bot_word {
  position: relative;
  z-index: 1;
}

.left_word {
  width: 50%;
  height: 100%;
  color: #979797;
}

.right_word {
  width: 50%;
  height: 100%;
  color: #979797;
}
</style>

