<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    "
  >
    <div
      style="
        width: 400px;
        background-color: rgba(119, 136, 153, 0.2);
        border-radius: 10px;
      "
    >
      <div
        style="
          width: 100%;
          height: 100px;
          font-size: 30px;
          line-height: 100px;
          text-align: center;
          color: #eee;
        "
      >
        欢迎登录
      </div>
      <el-form
        ref="loginForm"
        :model="user"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱：" prop="username">
          <el-input
            v-model="user.username"
            placeholder="请输入邮箱账号"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="user.password"
            show-password
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item label="验证码：" prop="code">
          <el-row>
            <el-col :span="13">
              <el-input
                v-model="user.code"
                class="validate-code"
                placeholder="请输入验证码"
                prefix-icon="el-icon-warning-outline"
              />
            </el-col>
            <el-col :span="11" align="right">
              <div class="login-identity">
                <Identify @click="refreshCode" :identifyCode="identifyCode" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="7">
            <el-link
              :underline="false"
              style="
                font-size: 16px;
                margin-top: 9px;
                display: inline-block;
                color: #409eff;
              "
              href="../index/homePage"
              >返回首页
            </el-link>
          </el-col>
          <el-col :span="17">
            <el-button
              style="display: inline-block; font-size: 16px"
              type="text"
              @click="centerDialogVisible = true"
              >忘记密码?
            </el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            @click="login"
            style="
              height: 40px;
              width: 80%;
              margin-top: 10px;
              background-color: mediumseagreen;
              color: white;
              border-radius: 5px;
            "
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item align="right">
          <a style="color: #eee" href="../register">还没账号？去注册</a>
        </el-form-item>
        <el-dialog
          title="提示"
          v-model="centerDialogVisible"
          width="25%"
          center
        >
          <span>
            请联系作者<br />
            QQ：1491900793<br />
            微博：电竞选手稳如狗<br />
          </span>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="centerDialogVisible = false"
                >关 闭</el-button
              >
            </span>
          </template>
        </el-dialog>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import post from ".././http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import Identify from "./Identify.vue";
import router from "@/router";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    Identify,
  },
  props: {},
  setup() {
    const store = useStore();
    const loginForm = ref();
    // 页面数据
    const state = reactive({
      user: {
        username: "", //13345678911
        email: "", //shuaigang@163.com   暂未使用
        password: "", //Aa111111
        code: "", //验证码
      },
      identifyCodes: "1234567890", //1234567890abcdefjhijklinopqrsduvwxyz
      identifyCode: "",
      // 校验
      rules: {
        // username: [
        //   {
        //     required: true,
        //     message: "示例：13345678911",
        //     trigger: "blur",
        //     type: "number",
        //     transform(value) {
        //       let regex = /^1[3|4|5|7|8]\d{9}$/;
        //       if (regex.test(value)) {
        //         return Number(value);
        //       }
        //     },
        //   },
        // ],
        username: [
          {
            required: true,
            message: "邮箱不能为空或邮箱格式错误",
            trigger: "blur",
            transform(value) {
              let regex =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
        ],
        password: [
          {
            required: true,
            message: "示例：Aa123456(8-16位)",
            trigger: "blur",
            transform(value) {
              // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
              let regex = /^[A-Za-z0-9]{8,16}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
        ],
        code: [
          {
            required: true,
            message: "示例：8888",
            trigger: "blur",
            type: "number",
            transform(value) {
              if (value) {
                return Number(value);
              }
            },
          },
        ],
      },
      //忘记密码窗口参数
      centerDialogVisible: false,
      //背景图片路径设置
      loginBg: "url(" + require("../assets/mao.gif") + ")",
    });
    // 方法体
    const methods = {
      // 进入VUE时首先调用的钩子函数
      mounted() {
        // 添加背景图片
        document.body.style.backgroundSize = "contain";
        document.body.style.backgroundImage = state.loginBg;

        // 初始化验证码
        state.identifyCode = "";
        methods.makeCode(state.identifyCodes, 4);
        console.log(state.identifyCode);
      },
      // 离开VUE时调用的钩子函数
      beforeUnmount() {
        // 清除背景图片
        document.body.style.backgroundImage = "";
      },
      // 重置验证码
      refreshCode() {
        state.identifyCode = "";
        methods.makeCode(state.identifyCodes, 4);
      },
      //生成验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          state.identifyCode +=
            state.identifyCodes[
              methods.randomNum(0, state.identifyCodes.length)
            ];
        }
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      //登录
      login() {
        const form = loginForm.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            if (
              //toLowerCase()
              state.user.code !== state.identifyCode
            ) {
              ElMessage.error("验证码错误");
              methods.refreshCode();
            } else {
              request.userLogin();
            }
          }
        });
      },
    };
    // 页面默认请求
    onMounted(() => {
      methods.mounted();
    });
    // 请求
    const request = {
      userLogin() {
        // 请求体数据
        const data = {
          // 手机号登录
          // customData: {
          //   type: "mobile",
          //   loginData: state.user,
          // },
          // 邮箱登录
          customData: {
            type: "account",
            loginData: state.user,
          },
        };
        // post请求
        post("/authentication/form", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            // console.log(customData.Authorization);
            ElMessage.success("登陆成功！");
            // 缓存到store中
            // store.commit("setUserId", customData.userId);
            // store.commit("setRole", customData.role);
            // console.log(store.getters.userId);
            // console.log(store.getters.role);
            // 缓存到浏览器中 Local Storage 中
            localStorage.setItem("token", customData.Authorization);
            localStorage.setItem("shuaigangOVO", customData.userId);
            localStorage.setItem("shuaigangQWQ", customData.role);
            // console.log(localStorage.getItem('userId'));
            // console.log(localStorage.getItem('shuaigangQWQ'));
            router.push("/index/homePage");
            methods.beforeUnmount();
          } else {
            ElMessage.error(message);
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), loginForm };
  },
});
</script>

<style scoped>
.login-identity {
  width: 100%;
}
.el-form {
  width: 90%;
}
.el-col-7 {
  text-align: right;
}
.el-col-17 {
  text-align: right;
}
:deep(.el-form-item__label) {
  color: #eee !important;
}
</style>

