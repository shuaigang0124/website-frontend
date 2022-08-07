<template>
  <div class="update">
    <el-container>
      <el-header class="detail-header">
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
                margin-top: 6px;
                text-align: left;
                font-size: 16px;
              "
            >
              &nbsp;&nbsp;<i
                class="el-icon-s-promotion"
                style="color: yellow"
              ></i
              >编辑日常分享
            </div>
          </el-col>
          <el-col :span="4">
            <div v-if="user.id" class="el-user-welcome">
              <el-avatar :size="35" :src="user.avatar"></el-avatar>
              <el-link
                :underline="false"
                @click="openLogin"
                style="
                  margin-left: 10px;
                  color: white;
                  font-size: 16px;
                  display: -webkit-box;
                  overflow: hidden;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                "
              >
                {{ user.userName }}
              </el-link>
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
      <el-main class="detail-main">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form
              ref="releaseForm"
              :model="releaseData"
              :rules="rules"
              label-width="120px"
            >
              <el-form-item label="标题：" prop="title">
                <el-input v-model="releaseData.title" />
              </el-form-item>
              <el-form-item label="标题描述：" prop="titleDescribe">
                <el-input v-model="releaseData.titleDescribe" />
              </el-form-item>
              <el-form-item label="所属标签：" prop="tagId">
                <el-select
                  v-model="releaseData.tagId"
                  placeholder="请选择所属标签"
                >
                  <el-option
                    v-for="tags in tags"
                    :key="tags.name"
                    :label="tags.name"
                    :value="tags.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="3">
                <b style="color: red">*&nbsp;</b>
                <b>预览图：</b>
              </el-col>
              <el-col :span="21">
                <el-upload
                  class="upload-demo"
                  drag
                  action="123"
                  multiple
                  :http-request="uploadImg"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                >
                  <div v-if="!releaseData.img">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      点击（或拖拽图片到此处）<em>进行上传</em>
                    </div>
                  </div>
                  <div v-else>
                    <el-image :src="releaseData.img"></el-image>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">图片大小不能超过2M</div>
                  </template>
                </el-upload>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="2" align="right">
            <b style="color: red">*&nbsp;</b>
            <b>内容：</b>
          </el-col>
          <el-col :span="22">
            <TEditor ref="editRef" :value="releaseData.content" />
          </el-col>
        </el-row>
        <div align="center" style="margin-top: 15px">
          <el-button @click="cancelUpdate">取消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
        </div>
      </el-main>
      <el-footer class="detail-footer">
        <div style="margin-top: 8px">帅刚©2021</div>
        <el-link :underline="false" @click="record3"
          >渝ICP备2021011002号</el-link
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import post from ".././http/axios/index";
import { ElMessage } from "element-plus";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { Base64 } from "js-base64";
import TEditor from "../components/txt/TEditor.vue";
import router from "@/router";
import store from "@/store";
export default defineComponent({
  components: {
    TEditor,
  },
  props: {},
  setup() {
    const releaseForm = ref();
    const editRef = ref();
    // 页面数据
    const state = reactive({
      // 页脚链接
      detailfooter: {
        link2: "https://beian.miit.gov.cn",
      },
      // 用户登录数据
      user: {
        id: "",
        avatar: "",
        userName: "",
      },
      tags: {
        id: "",
        name: "",
      },
      releaseData: {
        id: "",
        userId: "",
        tagId: "",
        title: "",
        titleDescribe: "",
        content: "",
        img: "",
      },
      releaseForm: {
        tagId: "",
        title: "",
        titleDescribe: "",
        img: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "输入数据不能为空",
            trigger: "blur",
          },
        ],
        titleDescribe: [
          {
            required: true,
            message: "输入数据不能为空",
            trigger: "blur",
          },
        ],
        tagId: [
          {
            required: true,
            message: "输入数据不能为空",
            trigger: "blur",
          },
        ],
      },
    });
    // 方法体
    const methods = {
      record3() {
        window.open(state.detailfooter.link2);
      },
      // 登录
      openLogin() {
        window.open("/userData");
      },
      // 退出
      logout() {
        request.logout();
        state.user.id = "";
        localStorage.setItem("token", "");
        localStorage.setItem("shuaigangOVO", "");
        localStorage.setItem("shuaigangQWQ", "");
        window.location.reload();
      },
      // 上传成功回调
      handleSuccess(res, file) {},
      // 上传前格式和图片大小限制
      beforeUpload(file) {
        const type = file.type === "image/jpeg" || "image/jpg" || "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!type) {
          ElMessage.error("图片格式不正确!(只能包含jpg，png，jpeg)");
        }
        if (!isLt2M) {
          ElMessage.error("上传图片大小不能超过 2MB!");
        }
        return type && isLt2M;
      },
      uploadImg(file) {
        let formData: any = new FormData();
        formData.append("multipartFile", file.file);
        formData.append("type", 2);
        request.uploadImg(formData);
        // console.log(file);
        console.log(file.file);
      },
      // 取消修改
      cancelUpdate() {
        // 请求体数据
        const data = {
          customData: {
            filePath: state.releaseData.img,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          // console.log(res);
        });
        router.push({
          path: "/index/dailySharing",
        });
      },
      // 确定修改
      update() {
        const form = releaseForm.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            request.updateSharing();
          }
        });
      },
    };
    // 页面默认请求
    onMounted(() => {
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId) {
        let id = Base64.decode(userId);
        request.getUserDetails(id);
      }
      state.releaseData = store.getters.dailySharing;
      request.getSharingDetail(state.releaseData.id);
    });
    // 请求
    const request = {
      // 上传预览图
      uploadImg(formData) {
        // post请求
        post("xx/xx/xx/xx", formData).then((res: any) => {
          let { code, message, customData } = res;
          if (message === "OK" && code === 200) {
            // console.log(res);
            state.releaseData.img = customData.imgPath;
          }
        });
      },
      getSharingDetail(id) {
        // 请求体数据
        const data = {
          customData: {
            id,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code === 200) {
              state.releaseData.content = customData.content;
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      // 修改
      updateSharing() {
        // 内容赋值
        const form = editRef;
        let content = form.value.contentValue;
        state.releaseData.content = content;
        // 请求体数据
        const data = {
          customData: {
            sharingId: state.releaseData.id,
            title: state.releaseData.title,
            titleDescribe: state.releaseData.titleDescribe,
            tagId: state.releaseData.tagId,
            img: state.releaseData.img,
            content: state.releaseData.content,
          },
        };
        // console.log(state.releaseData),
          // post请求
          post("xx/xx/xx/xx", data).then(
            (res: any) => {
              let { code, message, customData } = res;
              if (code === 200) {
                ElMessage.success(message);
                router.push({
                  path: "/index/dailySharing",
                });
              } else {
                ElMessage.error(message);
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
      // 用户登录数据
      getUserDetails(id) {
        // 请求体数据
        const data = {
          customData: {
            userId: id,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            state.user = customData;
            request.getTags();
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
    };
    return { ...methods, ...toRefs(state), releaseForm, editRef };
  },
});
</script>

<style scoped>
:deep(.el-dialog__footer) {
  text-align: center !important;
}
.detail-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-user-welcome {
  width: 100%;
  display: flex;
  align-items: center;
}

.detail-main {
  height: calc(100vh - 120px);
  background-color: #ebf7f4;
  color: #333;
}

.el-main::-webkit-scrollbar {
  display: none;
}

.detail-footer {
  background-color: #e8ebee;
  color: #333;
  text-align: center;
  width: 100%;
  bottom: 0;
  position: fixed;
}
.el-main {
  padding: 2% !important;
}
</style>

