<template>
  <el-main id="homePage">
    <div id="image_div">
      <div class="song-img" ref="rotate">
        <div v-if="playState === 'paused'" @click="play">
          <i style="color: red; font-size: 1.5rem" class="el-icon-video-play" />
        </div>
        <div v-else @click="pause">
          <i
            style="color: red; font-size: 1.5rem"
            class="el-icon-video-pause"
          />
        </div>
      </div>
      <div
        style="
          color: #fff;
          text-align: center;
          letter-spacing: 5px;
          text-indent: 5px;
        "
      >
        <h1 style="color: white; font-size: 1.1rem; font-weight: bold">
          忠誠勇敢 平安喜樂 得償所願
        </h1>
        <b>Keep You Head Up Princess ♫</b>
      </div>
    </div>
    <el-row type="flex" justify="center" class="homePage">
      <el-col :span="17">
        <div style="height: 15vh">
          <div style="margin-top: 10vh">
            下滑展示更多<i class="el-icon-download"></i>
          </div>
        </div>
        <!-- <el-carousel :interval="4000" type="card" height="30vh">
          <el-carousel-item v-for="item in item" :key="item">
            <el-image
              class="medium"
              :src="item.image"
              style="width: 100%; height: 100%"
            />
          </el-carousel-item>
        </el-carousel> -->

        <el-row style="margin-top: 10px">
          <el-col :span="3" align="right">
            <p>
              <span style="font-size: 20px"><strong>公告：</strong></span>
            </p>
          </el-col>
          <el-col :span="21">
            <p v-for="noticeData in noticeData" :key="noticeData">
              <span
                :style="{
                  backgroundColor:
                    noticeData.colorId === 1
                      ? '#7fffaa'
                      : noticeData.colorId === 2
                      ? '#87ceeb'
                      : noticeData.colorId === 3
                      ? 'yellow'
                      : noticeData.colorId === 4
                      ? '#e03e2d'
                      : 'null',
                }"
              >
                {{ noticeData.content }}
              </span>
            </p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="1"> </el-col>
      <el-col :span="6">
        <div>
          <!--倒计时开始-->
          <div class="gn_box">
            <h1>
              <span style="color: #e80017">{{ aa }}</span
              ><span style="color: #d1002e">{{ bb }}</span
              ><span style="color: #ba0045">{{ cc }}</span
              ><span style="color: #a3005c">{{ dd }}</span
              ><span style="color: #8c0073">年</span
              ><span style="color: #75008a">-</span
              ><span style="color: #5e00a1">新</span
              ><span style="color: #4700b8">年</span
              ><span style="color: #3000cf">倒</span
              ><span style="color: #1900e6">计</span
              ><span style="color: #0200fd">时</span>
            </h1>
            <span>
              <div id="CountMsg" class="HotDate">
                <!-- <span id="t_d"/>
                <span id="t_h"/>
                <span id="t_m"/>
                <span id="t_s"/> -->
                <span id="t_d">365 天</span>
                <span id="t_h">24 时</span>
                <span id="t_m">60 分</span>
                <span id="t_s">60 秒</span>
              </div>
            </span>
          </div>
          <!--倒计时结束-->
          <el-card style="background-color: #4e4e4e; color: #e3e3e3">
            <div
              style="
                border-bottom: 1px solid orangered;
                padding-bottom: 10px;
                font-size: 20px;
                display: inline-block;
                width: 100%;
              "
            >
              <span style="margin-right: 20px">站长简介</span>
              <a v-if="user.role === '管理员'" href="/service/home">
                <el-button size="mini">进入后台</el-button>
              </a>
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
            <div style="margin-top: 10px"></div>
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
                <el-button type="info" disabled
                  >点击或扫描图片加入网站交流群【隔江明月照莲华】</el-button
                >
              </el-row>
              <a @click="linkOpen(website.link)">
                <el-button style="width: 100%; margin-top: 10px">
                  <el-image
                    :src="website.advertising"
                    style="width: 80%"
                  ></el-image>
                </el-button>
              </a>
            </div>

            <div v-else>广告已关闭</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- <audio ref="videoPlayer" src="../assets/Keep.mp3" loop></audio> -->
    <video ref="videoPlayer" src="../assets/Keep.mp3" loop></video>
  </el-main>
</template>

<script lang="ts">
import { useStore } from "vuex";
import post from ".././http/axios/index";
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import moment from "moment";
import { Base64 } from "js-base64";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const store = useStore();
    const videoPlayer = ref();
    const rotate = ref();
    let timer = null;
    // 页面数据
    const state = reactive({
      nowYear: "2100",
      aa: 2,
      bb: 1,
      cc: 0,
      dd: 0,
      playState: "paused",
      image: require("../assets/qq.jpg"),
      website: {
        img: "1",
        link: "https://jq.qq.com/?_wv=1027&k=wenrXmAG",
        advertising:
          "https://shuaigang.top/gsg/static-resource/formal/6/20220126/1643167170162-1352217726720448.webp",
      },
      user: {
        role: "",
      },
      noticeData: [
        {
          id: "",
          sort: null,
          content: "",
          colorId: null,
        },
      ],
      item: [
        {
          image:
            "https://www.shuaigang.top/gsg/static-resource/formal/2/20211214/1639481828589-1296438034426335.webp",
        },
        {
          image:
            "https://www.shuaigang.top/gsg/static-resource/formal/2/20211209/222.webp",
        },
        {
          image:
            "https://www.shuaigang.top/gsg/static-resource/formal/2/20211213/1639397709708-1212319153463058.webp",
        },
        {
          image:
            "https://www.shuaigang.top/gsg/static-resource/formal/2/20211223/1640241713417-349010861064347.webp",
        },
      ],
    });
    // 方法体
    const methods = {
      play() {
        const value = videoPlayer.value;
        const value2 = rotate.value;
        // this.$refs.audio.play();
        // this.audio.playing = true;
        // console.log(videoPlayer);
        console.log(rotate);
        // console.log(value);
        // console.log(value2);
        value2.style.animationPlayState = "running";
        state.playState = "running";
        value.play();
      },
      pause() {
        const value = videoPlayer.value;
        const value2 = rotate.value;
        value2.style.animationPlayState = "paused";
        state.playState = "paused";
        value.pause();
      },

      linkOpen(link) {
        window.open(link); //新窗口打开链接
      },
      getRTime() {
        var EndTime = new Date(state.nowYear+"/01/01 00:00:00");
        var NowTime = new Date();
        var t = EndTime.getTime() - NowTime.getTime();
        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor((t / 1000 / 60 / 60) % 24);
        var m = Math.floor((t / 1000 / 60) % 60);
        var s = Math.floor((t / 1000) % 60);
        document.getElementById("t_d").innerHTML = d + " 天";
        document.getElementById("t_h").innerHTML = h + " 时";
        document.getElementById("t_m").innerHTML = m + " 分";
        document.getElementById("t_s").innerHTML = s + " 秒";
      },
    };

    // 页面默认请求
    onMounted(() => {
      var yearNow = new Date();
      var nowYear = yearNow.getFullYear().toString();
      state.nowYear = (Number(nowYear) + 1).toString();
      state.aa = Number(nowYear.charAt(0));
      state.bb = Number(nowYear.charAt(1));
      state.cc = Number(nowYear.charAt(2));
      state.dd = Number(nowYear.charAt(3)) + 1;

      let role = localStorage.getItem("shuaigangQWQ");
      // console.log(role);
      if (role) {
        state.user.role = Base64.decode(role);
      }
      request.getNotice();
      timer = setInterval(() => {
        methods.getRTime();
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });
    // 请求
    const request = {
      getNotice() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.noticeData = customData;
            // console.log(state.noticeData);
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), videoPlayer, rotate, timer };
  },
});
</script>

<style scoped>
.song-img {
  /* opacity: 0.7; */
  width: 6rem;
  height: 6rem;
  margin-right: 20px;
  border-radius: 50%;
  background-image: url(../assets/8888.jpg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: animations1 5s linear infinite forwards;
  animation-play-state: paused;
}

@keyframes animations1 {
  0% {
    /* transform: translate(-50%, -50%) rotate(0deg) */
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.homePage {
  margin: 0 4% 180px 4%;
}

#image_div {
  width: 100%;
  background-image: url(../assets/7878.jpg);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  /* opacity: 0.75; */
  /* line-height: 200px; */
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 倒计时开始 */
.gn_box {
  height: 15vh;
  padding: 0 0 0 14px;
  margin-bottom: 20px;
  text-align: center;
  /* background-color: #fff; */
}
#t_d {
  color: #982585;
  font-size: 18px;
}
#t_h {
  color: #8f79c1;
  font-size: 18px;
}
#t_m {
  color: #65b4b5;
  font-size: 18px;
}
#t_s {
  color: #83caa3;
  font-size: 18px;
}
</style>

