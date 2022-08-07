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
      <el-form
        ref="refForm"
        :model="user"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          ><div
            style="
              font-size: 30px;
              color: #eee;
              margin-top: 20px;
              margin-left: 20px;
            "
          >
            欢迎注册
          </div></el-form-item
        >
        <el-form-item label="用户昵称：" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="示例：帅刚（中文2-8位）"
          />
        </el-form-item>

        <!-- <el-form-item label="生日：" prop="birthday">
          <el-date-picker
            v-model="user.birthday"
            type="date"
            placeholder="请选择生日"
            style="width: 100%"
            :disabled-date="disabledDate"
            :editable="false"
          ></el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item label="电话：" prop="phone">
          <el-input v-model="user.phone" />
        </el-form-item> -->
        <el-form-item label="邮箱账号：" prop="email">
          <el-input
            v-model="user.email"
            placeholder="示例：1491900793@qq.com"
          />
        </el-form-item>
        <el-form-item label="">
          <el-row :gutter="10">
            <el-col :span="13">
              <el-input
                v-model="validCode"
                class="validate-code"
                placeholder="请输入验证码"
                :prefix-icon="
                  Code === 1
                    ? 'el-icon-warning-outline'
                    : Code === 2
                    ? 'el-icon-success'
                    : 'el-icon-error'
                "
                v-on:input="change"
              />
            </el-col>
            <el-col :span="11" align="right">
              <el-button type="text" @click="send" style="color: white"
                >点击发送验证码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="设置密码：" prop="password">
          <el-input
            v-model="user.password"
            placeholder="示例：Aa123456"
            show-password
          />
        </el-form-item>
        <!-- <el-form-item label="地址：" prop="address">
          <el-input v-model="user.address" />
        </el-form-item> -->
        <!-- <el-form-item label="选择性别：" prop="sex">
          <el-radio-group v-model="user.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item style="margin-top: 40px">
          <el-button
            @click="register"
            style="
              height: 40px;
              width: 60%;
              background-color: steelblue;
              color: white;
            "
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item align="right">
          <a style="color: #eee" href="../login">已有账号，去登录</a>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import post from ".././http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import router from "../router/index";
import { ElMessage } from "element-plus";
import moment from "moment";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const refForm = ref();
    // 页面数据
    const state = reactive({
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      validCode: null,
      email: "",
      Code: 1,
      user: {
        userName: "",
        password: "",
        birthday: null,
        address: "Chongqing",
        phone: "18888888888",
        sex: "1",
        email: "",
      },
      //背景图片
      loginBg: "url(" + require("../assets/dog.gif") + ")",
      rules: {
        userName: [
          {
            required: true,
            message: "昵称不能为空且只能为中文2-8位",
            trigger: "blur",
            transform(value) {
              let regex = /^[\u4e00-\u9fa5]{2,8}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空且只能为数字或者大小写字母(8-16位)",
            trigger: "blur",
            transform(value) {
              // 大小写字母+数字8-16
              // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
              let regex = /^[A-Za-z0-9]{8,16}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
        ],
        phone: [
          {
            required: true,
            message: "示例：13345678911",
            trigger: "blur",
            type: "number",
            transform(value) {
              let regex = /^1[3|4|5|7|8]\d{9}$/;
              if (regex.test(value)) {
                return Number(value);
              }
            },
          },
        ],
        email: [
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
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请输入生日",
            trigger: "change",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
      },
    });
    // 方法体
    const methods = {
      // 进入VUE时首先调用的钩子函数
      mounted() {
        // 添加背景图片
        document.body.style.backgroundSize = "contain";
        document.body.style.backgroundImage = state.loginBg;
      },
      // 离开VUE时调用的钩子函数
      beforeUnmount() {
        // 清除背景图片
        document.body.style.backgroundImage = "";
      },
      // 发送验证码
      send() {
        if (state.user.email) {
          request.sendMailCode();
        } else {
          ElMessage.error("邮箱不能为空");
        }
      },
      // 验证码校验
      change: function () {
        // console.log(state.validCode )
        if (state.validCode > 999 && state.validCode < 10000) {
          request.checkMailCode();
        } else {
          state.Code = 0;
        }
      },
      // 注册
      register() {
        const form = refForm.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid && state.Code === 2 && state.user.email === state.email) {
            state.user.birthday = Date.now();
            (state.user.birthday = moment(state.user.birthday).format(
              "YYYY-MM-DD"
            )),
              request.insert();
          } else if (state.Code !== 2) {
            ElMessage.warning("验证码错误！");
          } else if (state.user.email !== state.email) {
            ElMessage.warning("发送邮箱后请勿在做更改！");
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
      insert() {
        const data = {
          customData: state.user,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.updateCityValue(state.user.address, 99);
            router.push("/login");
            methods.beforeUnmount();
          } else {
            ElMessage.error(message);
          }
        });
      },
      updateCityValue(id, subtractOrAdd) {
        // 请求体数据
        const data = {
          customData: {
            id,
            subtractOrAdd,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code } = res;
          if (code === 200) {
            console.log("城市用户数据添加成功");
          } else {
            return;
          }
        });
      },
      sendMailCode() {
        const data = {
          customData: {
            type: 2,
            email: state.user.email,
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            state.email = state.user.email;
          } else {
            ElMessage.info(message);
          }
        });
      },
      checkMailCode() {
        const data = {
          customData: {
            type: 2,
            email: state.user.email,
            validCode: state.validCode,
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            state.Code = 2;
          } else {
            ElMessage.info(message);
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), refForm };
  },
});
</script>

<style scoped>
.el-form {
  width: 90%;
}
:deep(.el-form-item__label) {
  color: #eee !important;
}
:deep(.el-icon-success:before) {
  color: #00ff00 !important;
}
:deep(.el-icon-error:before) {
  color: #fc0404 !important;
}
</style>

