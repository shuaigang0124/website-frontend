<template>
  <el-main id="travel">
    <el-row class="travel">
      <el-col :span="5" style="height: 90vh">
        <el-scrollbar>
          <el-menu
            :unique-opened="true"
            active-text-color="Blue"
            background-color="#ebf7f4"
            default-active="2021"
            text-color="black"
            class="menuLeft"
            style="margin-top: 2vh"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu index="1" :disabled="disabled">
              <template #title>
                <span style="font-size: 16px"><b>年度计划</b></span>
              </template>
              <div v-for="year in year" :key="year">
                <el-menu-item
                  :index="year.id"
                  @click="yearOpen(year)"
                  :disabled="disabled"
                >
                  {{ year.title }}
                </el-menu-item>
              </div>
            </el-submenu>
            <el-submenu index="2" :disabled="disabled">
              <template #title>
                <span style="font-size: 16px"><b>日记</b></span>
              </template>
              <div v-for="diary in diary" :key="diary">
                <el-menu-item
                  :index="diary.id"
                  @click="diaryOpen(diary)"
                  :disabled="disabled"
                >
                  {{ diary.day }}
                </el-menu-item>
              </div>
            </el-submenu>
            <el-submenu index="3" :disabled="disabled">
              <template #title>
                <span style="font-size: 16px"><b>旅程</b></span>
              </template>
              <div v-for="travel in travel" :key="travel">
                <el-menu-item
                  :index="travel.id"
                  @click="travelOpen(travel)"
                  :disabled="disabled"
                >
                  {{ travel.cityName
                  }}<span
                    v-if="travel.travelList !== null"
                    style="color: green; margin-left: 10px"
                    >✔</span
                  >
                </el-menu-item>
              </div>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-col>
      <el-col :span="19">
        <el-row>
          <el-col :span="20">
            <div v-if="!sx_gsg" class="password">
              <div
                style="
                  text-align: center;
                  letter-spacing: 5px;
                  text-indent: 5px;
                "
              >
                <el-button type="text" style="font-size: 40px" @click="open1">
                  <i class="el-icon-lock" />
                </el-button>
                <div>
                  <el-button type="text" @click="open2">
                    该内容已被锁定，输入密码后解锁
                  </el-button>
                </div>
                <span style="font-size: 13px; color: #909399"
                  >Ctrl + Enter 快捷键唤起输入面板</span
                >
                <el-dialog
                  v-model="dialogVisible"
                  :title="lock"
                  :lock-scroll="false"
                  width="10%"
                  :show-close="false"
                  :before-close="handleClose11"
                >
                  <el-input
                    type="password"
                    ref="clickPosition"
                    v-model="password"
                    v-on:input="change"
                    maxlength="6"
                  />
                </el-dialog>
              </div>
            </div>
            <div v-else style="margin: 4vh 0 0 2vw">
              <div v-if="rightState === 1">
                <div style="font-size: 1.8rem">{{ yearData.title }}</div>
                <div style="margin-top: 15px">{{ yearData.content }}</div>
                <div v-for="list in yearData.listingData" :key="list">
                  <div style="margin-top: 15px">
                    <i
                      :style="{
                        color:
                          list.isEnabled === 0
                            ? '#3eaf7c'
                            : list.isEnabled === 1
                            ? '#fab905'
                            : list.isEnabled === 2
                            ? '#f56c6c'
                            : '#A9A9A9',
                      }"
                      :class="
                        list.isEnabled === 0
                          ? 'el-icon-success'
                          : list.isEnabled === 1
                          ? 'el-icon-warning'
                          : list.isEnabled === 2
                          ? 'el-icon-error'
                          : 'el-icon-question'
                      "
                    />&nbsp;&nbsp;{{ list.plan }}
                  </div>
                </div>
              </div>
              <div v-if="rightState === 2">
                <div>
                  <span style="font-size: 1.8rem">{{
                    diaryData.day.slice(0, 4)
                  }}</span>
                  <span style="font-size: 1.2rem">
                    _{{
                      diaryData.day.slice(
                        diaryData.day.length - 5,
                        diaryData.day.length - 3
                      )
                    }}_{{
                      diaryData.day.slice(
                        diaryData.day.length - 2,
                        diaryData.day.length
                      )
                    }}_{{ diaryData.weather }}_{{ diaryData.mood }}
                  </span>
                </div>
                <div
                  style="margin-left: 20px; margin-top: 15px"
                  v-html="diaryData.content"
                />
              </div>
              <div v-if="rightState === 3">
                <div style="font-size: 1.8rem">{{ travelData.cityName }}</div>
                <div v-for="list in travelData.travelList" :key="list">
                  <div
                    style="font-size: 1.1rem; margin-top: 15px"
                    v-html="list.dayTime"
                  />
                  <div style="margin-top: 15px" v-html="list.content" />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang="ts">
import post from ".././http/axios/index";
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { ElMessage } from "element-plus";
import { Base64 } from "js-base64";
export default defineComponent({
  name: "",
  components: {},
  props: {},
  setup() {
    const clickPosition = ref();
    const state = reactive({
      // 控制菜单是否可点击（true：否；flase：是）
      disabled: true,
      // 解锁串口图像
      lock: "🔐",
      // 右边页面分区显示
      rightState: 1,
      // 是否已解锁（false：否；true：是）
      sx_gsg: false,
      // 是否打开密码输入框（false：否；true：是）
      dialogVisible: false,
      // value: "",
      password: "",
      // 总的年度计划数据
      year: [
        {
          id: "",
          title: "",
          content: "",
          listingData: [
            {
              id: null,
              plan: "",
              isEnabled: 0,
            },
          ],
        },
      ],
      // 页面展示数据
      yearData: {
        id: "",
        title: "",
        content: "",
        listingData: [
          {
            id: null,
            plan: "",
            isEnabled: 0,
          },
        ],
      },
      // 总的日记数据
      diary: [
        {
          id: "",
          day: "",
          weather: "",
          mood: "",
          content: "",
        },
      ],
      // 页面日记展示数据
      diaryData: {
        id: "",
        day: "",
        weather: "",
        mood: "",
        content: "",
      },
      // 总的旅程数据
      travel: [
        {
          id: "",
          cityName: "",
          travelList: [
            {
              id: "",
              dayTime: "",
              content: "",
            },
          ],
        },
      ],
      // 页面展示路程数据
      travelData: [
        {
          id: "",
          cityName: "",
          travelList: [
            {
              id: null,
              dayTime: "",
              content: "",
            },
          ],
        },
      ],
    });
    const methods = {
      handleOpen() {},
      handleClose() {},
      // 点击🔒打开密码输入框
      open1() {
        if (!state.dialogVisible) {
          state.dialogVisible = true;
          // 定位到输入框
          nextTick(() => {
            clickPosition.value.focus();
          });
        }
      },
      // 点击文字打开密码输入框
      open2() {
        if (!state.dialogVisible) {
          state.dialogVisible = true;
          // 定位到输入框
          nextTick(() => {
            clickPosition.value.focus();
          });
        }
      },
      handleClose11() {
        state.dialogVisible = false;
      },
      // 监听键盘ctrl+enter打开庙貌输入框
      keyDown() {
        document.onkeydown = (e) => {
          if (e.ctrlKey && e.keyCode == 13 && state.dialogVisible == false) {
            //用户点击了ctrl+enter触发
            state.dialogVisible = true;
            // 定位到输入框
            nextTick(() => {
              clickPosition.value.focus();
            });
          } else if (
            e.ctrlKey &&
            e.keyCode == 13 &&
            state.dialogVisible == true
          ) {
            state.dialogVisible = false;
          }
        };
      },
      // 监听input输入
      change: function () {
        // if (state.value.length >= state.password.length) {
        //   state.password += state.value.slice(
        //     state.value.length - 1,
        //     state.value.length
        //   ); // 存取
        //   console.log(state.password + "第一次");
        // } else {
        //   state.password = state.password.substr(0, state.value.length);
        //   console.log(state.password + "第二次");
        // }
        // state.value = state.password.replace(/./g, "*");
        // console.log(state.password + "第三次");

        if (state.password.length === 6) {
          // password:071124
          if (state.password == Base64.decode("MDcxMTI0")) {
            request.getYearList();
            request.getDiaryList();
            request.getTravelList();
            state.lock = "🔓";
            ElMessage.success("验证通过！");
            setTimeout(function () {
              state.dialogVisible = false;
              state.sx_gsg = true;
              state.disabled = false;
            }, 700);
          } else {
            state.lock = "🔒";
            setTimeout(function () {
              state.lock = "🔐";
              state.password = "";
            }, 500);
          }
        }
      },
      yearOpen(year) {
        state.rightState = 1;
        state.yearData = year;
      },
      diaryOpen(diary) {
        state.rightState = 2;
        state.diaryData = diary;
      },
      travelOpen(travel) {
        state.rightState = 3;
        state.travelData = travel;
      },
    };
    onMounted(() => {
      methods.keyDown();
    });
    const request = {
      getDiaryList() {
        const data = {
          customData: {},
        };
        post("/shuaigang/v1/diary/getDiary", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.diary = customData;
          }
        });
      },
      getYearList() {
        const data = {
          customData: {},
        };
        post("/shuaigang/v1/year/getYearList", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.year = customData;
            for (let y in state.year) {
              if (state.year[y].id == "2021") {
                state.yearData = state.year[y];
                break;
              }
            }
          }
        });
      },
      getTravelList() {
        const data = {
          customData: {},
        };
        post("/shuaigang/v1/travel/getCityAndTravel", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.travel = customData;
          }
        });
      },
    };

    return { ...methods, ...toRefs(state), clickPosition };
  },
});
</script>
<style scoped>
.travel {
  margin: 60px 2% 180px 1%;
}
.password {
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-button--text {
  color: black;
}

.menuLeft .el-menu-item:hover {
  background: rgb(0, 0, 0, 0) !important;
}
:deep(.el-submenu__title:hover) {
  background-color: rgb(0, 0, 0, 0) !important;
}
:deep(.el-dialog__body) {
  padding: 10px 20px 30px 0;
}
:deep(.el-dialog) {
  border-radius: 15px;
}
:deep(.el-input__inner) {
  width: 60%;
}
:deep(.el-submenu.is-disabled .el-menu-item) {
  opacity: 1;
}
:deep(.el-submenu.is-disabled .el-submenu__title) {
  opacity: 1;
}
:deep(.el-submenu__icon-arrow) {
  right: 65% !important;
  margin-top: -4px !important;
}
:deep(.el-submenu__title i) {
  color: black !important;
}
</style>