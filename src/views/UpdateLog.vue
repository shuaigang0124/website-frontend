<template>
  <el-config-provider :locale="locale">
    <app />
  </el-config-provider>
  <el-main id="updateLog">
    <el-row type="flex" justify="center" class="updateLog">
      <el-col :span="6">
        <!-- 日历 -->
        <el-aside width="300px">
          <el-calendar v-model="value"> </el-calendar>
        </el-aside>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="10">
        <div class="block">
          <el-container>
            <!-- 更新日志 -->
            <el-main style="margin-left: 5%">
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in log"
                  :key="index"
                  :timestamp="log.content"
                >
                  <h4>{{ log.gmtCreate }}</h4>
                  <h5>{{ log.author }}:</h5>
                </el-timeline-item>
              </el-timeline>
            </el-main>
          </el-container>
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
              万事顺遂
            </div>
            <div style="margin-top: 10px">
              <!--                                  <a :href="'http://localhost:8888/page/front/blog.html?tag=' + item.name" v-for="item in tags">
                                                    <el-tag style="margin: 5px">{{item.name}}</el-tag>
                                                </a>-->
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

<script lang="ts">
import { ElConfigProvider, ElMessage } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import post from ".././http/axios/index";
export default defineComponent({
  components: {
    ElConfigProvider,
  },
  props: {},
  setup() {
    const state = reactive({
      value: new Date(),
      website: {
        img: "1",
        link: "https://www.jeep.com.cn/wrangler/jl/?mz_ca=2253619&mz_sp=7w3sT&mz_sb=1",
        advertising:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.58cdn.com.cn%2Fp1%2Fbig%2Fn_v2e1813b7c82444346ae52f36e2a2d469c.jpg&refer=http%3A%2F%2Fpic4.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634981915&t=0fafd7d8c17548c5ec832c42cd7722b3",
      },
      log: [
        {
          gmtCreate: "",
          content: "",
          author: "",
        },
      ],
    });
    const methods = {
      linkOpen(link) {
        window.open(link); //新窗口打开链接
      },
      imgChange() {
        state.website.img = "";
      },
    };
    const request = {};
    onMounted(() => {
      //传入值
      const data = {
        customData: {},
      };
      //调用接口返回数据
      post("xx/xx/xx/xx", data).then((res: any) => {
        //打印接收值
        let { code, message, customData } = res;
        state.log = customData;
      });
    });
    return {
      ...methods,
      ...toRefs(state),
      locale: zhCn,
    };
  },
});
</script>

<style scoped>

.updateLog {
  margin: 90px 4% 180px 4%;
}
.el-calendar {
  --el-calendar-cell-width: 40px !important;
}
:deep(.el-calendar__button-group) {
  display: none !important;
}
</style>

