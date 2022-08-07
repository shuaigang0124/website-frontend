<template>
  <div id="wrapper" v-cloak v-if="role === '管理员'">
    <el-container>
      <el-aside
        :width="isCollapse ? '64px' : '200px'"
        style="
          background-color: #867730;
          transition: width 0.5s;
          min-height: 100vh;
        "
      >
        <div
          style="
            background-color: #6f5905;
            height: 60px;
            line-height: 60px;
            text-align: center;
            color: white;
            font-size: 20px;
          "
        >
          <transition name="el-fade-in-linear">
            <span name="fade" v-show="!isCollapse">
              <a href="/service/home">
                <el-button
                  style="
                    color: #888;
                    background-color: beige;
                    font-weight: bold;
                  "
                  >后台管理系统</el-button
                ></a
              ></span
            >
          </transition>
        </div>
        <!-- 菜单 -->
        <el-menu
          style="border: none"
          router
          :default-active="$route.path"
          background-color="#867730"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
        >
          <el-menu-item index="/service/home">
            <i class="el-icon-s-home"></i><span>首页</span></el-menu-item
          >

          <el-menu-item index="/service/notice">
            <i class="el-icon-data-analysis"></i
            ><span>公告管理</span></el-menu-item
          >

          <el-menu-item index="/service/daily">
            <i class="el-icon-s-promotion"></i
            ><span>日常分享</span></el-menu-item
          >

          <el-menu-item index="/service/tag">
            <i class="el-icon-collection-tag"></i
            ><span>标签管理</span></el-menu-item
          >

          <el-menu-item index="/service/link">
            <i class="el-icon-s-operation"></i
            ><span>友情链接</span></el-menu-item
          >

          <el-menu-item index="/service/diary" v-if="userId === 'GSG1'">
            <i class="el-icon-s-comment"></i><span>日记管理</span></el-menu-item
          >

          <el-menu-item index="/service/year" v-if="userId === 'GSG1'">
            <i class="el-icon-s-comment"></i><span>年份管理</span></el-menu-item
          >
          <el-menu-item index="/service/yearPlan" v-if="userId === 'GSG1'">
            <i class="el-icon-s-comment"></i><span>计划管理</span></el-menu-item
          >

          <el-menu-item index="/service/travelManagement" v-if="userId === 'GSG1'">
            <i class="el-icon-s-comment"></i><span>旅行记录</span></el-menu-item
          >

          <el-menu-item index="/service/log" v-if="userId === 'GSG1'">
            <i class="el-icon-s-order"></i><span>更新日志</span></el-menu-item
          >

          <el-menu-item
            index="/service/userManagement"
            v-if="userId === 'GSG1'"
          >
            <i class="el-icon-s-custom"></i><span>用户管理</span></el-menu-item
          >

          <el-menu-item index="/service/about" v-if="userId === 'GSG1'">
            <i class="el-icon-s-platform"></i
            ><span>关于本站</span></el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          style="background-color: #5c5429; line-height: 60px; color: white"
        >
          <el-row>
            <el-col :span="1">
              <i
                style="font-size: 22px; cursor: pointer; color: #ff8080"
                :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
                @click="handleCollapse"
              ></i>
            </el-col>
            <el-col :span="1">
              <a href="/index/homePage">
                <el-button
                  size="mini"
                  style="color: #888; background-color: #f5f5dcff"
                  >返回前台页面</el-button
                >
              </a>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主体区域 -->
        <el-main>
          <iframe
            id="myiframe"
            frameborder="0"
            scrolling="no"
            style="width: 100%; height: 0"
          >
          </iframe>

          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Base64 } from "js-base64";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
  //   name: "HomePage",
  isCollapse: false,
  components: {},
  props: {},
  setup() {
    // 页面数据
    const state = reactive({
      isCollapse: false,
      role: "",
      userId: "",
    });
    // 方法体
    const methods = {
      handleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
    };
    // 页面默认请求
    onMounted(() => {
      let role = localStorage.getItem("shuaigangQWQ");
      let id = localStorage.getItem("shuaigangOVO");
      state.role = Base64.decode(role);
      state.userId = Base64.decode(id);
    });
    // 请求
    const request = {};
    return { ...methods, ...toRefs(state) };
  },
});
</script>

<style>
#warpper {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
  background-color: #f0f9eb;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-overlay {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
