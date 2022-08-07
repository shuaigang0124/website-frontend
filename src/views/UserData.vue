<template>
  <div>
    <el-container>
      <el-header class="user-header">
        <el-row>
          <el-col :span="5">
            <div style="color: white; text-align: right; font-size: 24px">
              隔江明月照莲华&nbsp;&nbsp;|
            </div>
          </el-col>
          <el-col :span="15">
            <div
              style="
                color: white;
                margin-left: 5px;
                text-align: left;
                font-size: 16px;
              "
            >
              &nbsp;&nbsp;个人中心
            </div>
          </el-col>
          <el-col :span="4">
            <div v-if="user.id" class="el-user-welcome">
              <el-avatar :size="35" :src="user.avatar"></el-avatar>
              <div
                :underline="false"
                style="
                  margin-left: 10px;
                  margin-right: 10px;
                  color: white;
                  font-size: 16px;
                  display: -webkit-box;
                  overflow: hidden;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                "
              >
                {{ user.userName }}
              </div>
              <el-button style="margin-left: 10px" size="mini" @click="logout"
                >退出</el-button
              >
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
      <el-main class="user-main" v-if="user.id">
        <el-row :gutter="20" style="height: 100%">
          <el-col :span="7" align="center">
            <el-card style="width: 80%; border-radius: 20px; height: 100%">
              <div
                style="text-align: left; margin-top: 20px; font-size: larger"
              >
                个人信息
              </div>
              <el-divider></el-divider>

              <el-upload
                class="avatar-uploader"
                action="shuaigang.top"
                :http-request="uploadUserAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="user.avatar" :src="user.avatar" class="avatar" />
                <img v-else :src="kong" class="avatar" />
              </el-upload>

              <div
                v-if="!updateState"
                style="color: black; font-size: 16px; margin-top: 20px"
              >
                点击头像进行修改
              </div>
              <div v-else align="center" style="margin-top: 20px">
                <el-button size="mini" round @click="cancelUpdateAvatar"
                  >取消</el-button
                >
                <el-button
                  size="mini"
                  round
                  type="primary"
                  @click="confirmUpdate"
                  >确定</el-button
                >
              </div>
              <el-divider style="margin-top: 40px"></el-divider>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card style="border-radius: 5px; height: 100%">
              <div
                style="text-align: left; margin-top: 20px; font-size: larger"
              >
                基本资料
              </div>
              <el-divider></el-divider>
              <el-tabs v-model="startName" @tab-click="activeClick">
                <el-tab-pane label="基本资料" name="first">
                  <el-form
                    ref="upadteUserForm"
                    :model="user"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
                  >
                    <el-form-item label="用户名：" prop="userName">
                      <el-input v-model="user.userName" />
                    </el-form-item>
                    <el-form-item label="生日：" required prop="birthday">
                      <el-date-picker
                        v-model="user.birthday"
                        type="date"
                        placeholder="请选择生日"
                        style="width: 100%"
                        :disabled-date="disabledDate"
                        :editable="false"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="电话号码：" prop="phone">
                      <el-input v-model="user.phone" />
                    </el-form-item>
                    <!-- <el-form-item label="邮箱：" prop="email">
                      <el-input v-model="user.email" />
                    </el-form-item> -->

                    <el-form-item label="地址：" prop="address" align="left">
                      <el-select v-model="user.address">
                        <el-option
                          v-for="cityData in cityData"
                          :key="cityData.cityName"
                          :label="cityData.cityName"
                          :value="cityData.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="性别：" prop="sex" align="left">
                      <el-radio-group v-model="user.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item align="center">
                      <span class="dialog-footer">
                        <el-button @click="cancelUpdate">取消</el-button>
                        <el-button type="primary" @click="updateUser"
                          >确定</el-button
                        >
                      </span>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="修改密码" name="second">
                  <el-form
                    ref="passwordForm"
                    :model="user"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
                  >
                    <el-form-item label="旧密码：" prop="oldPassword">
                      <el-input v-model="user.oldPassword" show-password />
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPassword">
                      <el-input v-model="user.newPassword" show-password />
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="newPassword2">
                      <el-input v-model="user.newPassword2" show-password />
                    </el-form-item>
                    <el-form-item align="center">
                      <span class="dialog-footer">
                        <el-button @click="cancelUpdatePassword"
                          >取消</el-button
                        >
                        <el-button type="primary" @click="updatePassword"
                          >确定</el-button
                        >
                      </span>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
          <el-col :span="7" align="center">
            <el-card style="width: 80%; height: 100%; border-radius: 20px">
              <div style="color: black; font-size: x-large; margin-top: 60px">
                Hi，{{ user.userName }} &nbsp;&nbsp;🎈
              </div>
              <el-divider style="margin-top: 40px"></el-divider>
              <el-row>
                <el-col :span="12">
                  <div style="font-size: large; text-align: left">帮助中心</div>
                </el-col>
                <el-col :span="12">
                  <div style="font-size: small; text-align: right">
                    <el-link
                      :underline="false"
                      type="primary"
                      style="color: #409eff"
                      disabled
                      >更多＞</el-link
                    >
                  </div>
                </el-col>
              </el-row>
              <div align="left" style="margin-top: 30px">
                <el-button
                  round
                  style="background-color: #dededa"
                  @click="clickMessage"
                  >如何注销账号？</el-button
                >
              </div>
              <!-- <div align="left" style="margin-top: 15px">
                <el-button round style="background-color: #dededa" @click="clickMessage"
                  >申诉未通过怎么办？</el-button
                >
              </div> -->
              <div align="left" style="margin-top: 15px">
                <el-button
                  round
                  style="background-color: #dededa"
                  @click="clickMessage"
                  >遇到风险，如何冻结？</el-button
                >
              </div>
              <el-divider></el-divider>
              <el-row>
                <el-col :span="12">
                  <div style="font-size: large; text-align: left">意见反馈</div>
                </el-col>
                <el-col :span="12">
                  <div style="font-size: small; text-align: right">
                    <el-link
                      :underline="false"
                      type="primary"
                      style="color: #409eff"
                      disabled
                      >更多＞</el-link
                    >
                  </div>
                </el-col>
              </el-row>
              <div align="left" style="margin-top: 30px">
                <el-button
                  round
                  style="background-color: #dededa"
                  @click="clickMessage"
                  >意见或建议</el-button
                >
              </div>
              <div align="left" style="margin-top: 15px">
                <el-button
                  round
                  style="background-color: #dededa"
                  @click="clickMessage"
                  >bug反馈</el-button
                >
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="user-footer">
        <div style="margin-top: 8px">帅刚©2021</div>
        <el-link :underline="false" @click="record2"
          >渝ICP备2021011002号</el-link
        >
      </el-footer>
    </el-container>
  </div>
</template>


<script lang="ts">
import post from "@/http/axios";
import { ElMessage } from "element-plus";
import { Base64 } from "js-base64";
import moment from "moment";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const handleOpen = (key, keyPath) => {};
    const handleClose = (key, keyPath) => {};
    // 页面数据
    const state = reactive({
      kong: "https://shuaigang.top/shuaigang/static-resource/formal/2/20211208",
      updateState: false,
      avatarPath: "",
      userfooter: {
        link: "https://beian.miit.gov.cn",
      },
      startName: "first",
      user: {
        id: "",
        address: "",
        avatar: "",
        birthday: "",
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
      },
      cityId: "",
      // userData: {
      //   id: "",
      //   userName: "",
      //   birthday: "",
      //   email: "",
      //   phone: "",
      //   avatar: "",
      //   sex: "",
      //   address: "",
      //   cityName: "",
      // },
      cityData: [
        {
          id: "",
          cityName: "",
        },
      ],
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "长度在二到八位之间",
            trigger: "blur",
          },
        ],
        oldPassword: [
          {
            required: true,
            message: "示例：Aa123456",
            trigger: "blur",
            transform(value) {
              let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
          {
            min: 8,
            max: 16,
            message: "长度在8到16位之间",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "示例：Aa123456",
            trigger: "blur",
            transform(value) {
              let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
          {
            min: 8,
            max: 16,
            message: "长度在8到16位之间",
            trigger: "blur",
          },
        ],
        newPassword2: [
          {
            required: true,
            message: "示例：Aa123456",
            trigger: "blur",
            transform(value) {
              let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
          {
            min: 8,
            max: 16,
            message: "长度在8到16位之间",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号格式错误",
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
            message: "示例：1491900793@qq.com",
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
      clickMessage() {
        ElMessage.warning("开发中~");
      },
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      activeClick() {},
      // 上传成功回调
      handleAvatarSuccess(res, file) {},
      // 上传前格式和图片大小限制
      beforeAvatarUpload(file) {
        const type = file.type === "image/jpeg" || "image/jpg" || "image/png";
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!type) {
          ElMessage.error("图片格式不正确!(只能包含jpg，png，jpeg)");
        }
        if (!isLt2M) {
          ElMessage.error("上传图片大小不能超过 1MB!");
        }
        return type && isLt2M;
      },
      uploadUserAvatar(file) {
        let formData: any = new FormData();
        formData.append("multipartFile", file.file);
        formData.append("userId", state.user.id);
        formData.append("type", 2);
        request.uploadAvatar(formData);
        // console.log(file);
        console.log(file.file);
      },
      // 取消修改头像
      cancelUpdateAvatar() {
        state.updateState = false;
        request.getList(state.user.id);
      },
      // 确定修改头像
      confirmUpdate() {
        request.updateAvatar(state.avatarPath);
      },
      // 取消修改用户
      cancelUpdate() {
        // 刷新页面重置信息
        // window.location.reload();
        request.getList(state.user.id);
      },
      // 修改用户
      updateUser() {
        (state.user.birthday = moment(state.user.birthday).format(
          "YYYY-MM-DD"
        )),
          // console.log(state.user);
          request.update();
      },
      // 取消修改密码
      cancelUpdatePassword() {
        // 刷新页面重置信息
        // window.location.reload();
        request.getList(state.user.id);
      },
      // 确定修改密码
      updatePassword() {
        request.checkPwd();
      },
      // 页脚连接新页面打开
      record2() {
        window.open(state.userfooter.link);
      },
      // 退出登录并清除token、userId、role
      logout() {
        request.logout();
        state.user.id = "";
        localStorage.setItem("token", "");
        localStorage.setItem("shuaigangOVO", "");
        localStorage.setItem("shuaigangQWQ", "");
        window.location.reload();
      },
    };
    // 页面默认请求
    onMounted(() => {
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId === "" || userId === null) {
      } else {
        let id = Base64.decode(userId);
        request.getList(id);
      }
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
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.user = customData;
            state.cityId = state.user.address;
            // console.log(state.user.avatar);
            request.getCity();
          } else {
            ElMessage.error(message);
          }
        });
      },
      getCity() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.cityData = customData;
          } else {
            ElMessage.error(message);
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
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
          }
        });
      },
      update() {
        // 请求体数据
        const data = {
          customData: state.user,
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            if (state.cityId !== state.user.address) {
              // console.log(state.cityId);
              request.updateCityValue(state.cityId, -1);
              // console.log(state.user.address);
              request.updateCityValue(state.user.address, 2);
            } else {
              request.getList(state.user.id);
            }
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
          let { code, message, customData } = res;
          if (code === 200) {
            request.getList(state.user.id);
          } else {
            return;
          }
        });
      },
      uploadAvatar(formData) {
        // 请求体数据

        // post请求
        post("xx/xx/xx/xx", formData).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            // console.log(res);
            state.user.avatar = customData.avatarPath;
            state.updateState = true;
            state.avatarPath = customData.avatarPath;
          } else {
            ElMessage.error(message);
          }
        });
      },
      updateAvatar(filePath) {
        // 请求体数据
        const data = {
          customData: {
            id: state.user.id,
            avatar: filePath,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            request.getList(state.user.id);
            ElMessage.success("修改成功！");
            state.updateState = false;
          } else {
            ElMessage.error(message);
          }
        });
      },
      checkPwd() {
        // 用户ID
        let userId = localStorage.getItem("shuaigangOVO");
        if (userId) {
          state.user.id = Base64.decode(userId);
        }
        // 请求体数据
        const data = {
          customData: {
            id: state.user.id,
            password: state.user.oldPassword,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            request.updatePwd();
          } else {
            ElMessage.error(message);
          }
        });
      },
      updatePwd() {
        // 用户ID
        let userId = localStorage.getItem("shuaigangOVO");
        if (userId) {
          state.user.id = Base64.decode(userId);
        }
        // 请求体数据
        const data = {
          customData: {
            id: state.user.id,
            oldPassword: state.user.oldPassword,
            newPassword: state.user.newPassword,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
          } else {
            ElMessage.warning(message);
          }
        });
      },
    };
    return {
      ...methods,
      ...toRefs(state),
      handleOpen,
      handleClose,
    };
  },
});
</script>

<style>
.user-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main::-webkit-scrollbar {
  display: none;
}

.user-main {
  height: calc(100vh - 120px);
  background-color: #ebf7f4;
  color: #333;
  text-align: center;
}

.user-footer {
  background-color: #e8ebee;
  color: #333;
  text-align: center;
  width: 100%;
  bottom: 0;
  position: fixed;
}

.el-user-data {
  width: 100%;
  display: flex;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-size: 100% 100%;
}
.avatar-uploader-icon {
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}
.el-user-welcome {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
