<template>
  <el-main id="message">
    <el-row class="message">
      <el-col :span="14" :offset="5" style="">
        <div style="margin: 10px -200px 50px -200px">
          <el-card style="display: flex">
            <div style="color: #888; font-size: 20px; flex: 1">在线留言</div>
            <!--                    分割线-->
            <div
              style="height: 1px; margin: 10px 0; background-color: #ccc"
            ></div>
            <div style="padding: 20px; color: #888">
              <el-input
                v-model="saveData.content"
                type="textarea"
                :rows="5"
                style="letter-spacing: 5px"
                placeholder="交换友链请留言！"
              ></el-input>
              <div style="text-align: right; padding: 20px">
                <el-button type="primary" @click="save"> 留言 </el-button>
              </div>
            </div>
            <!--                    分割线-->
            <div
              style="height: 1px; margin: 5px 0; background-color: #ccc"
            ></div>
            <div
              v-for="(messageData, index) in messageData"
              :key="messageData.id"
              style="display: flex; padding: 20px"
            >
              <div style="text-align: right; flex: 1">
                <div class="block">
                  <el-avatar :size="60" :src="messageData.avatar"></el-avatar>
                </div>
              </div>
              <div style="padding: 0 10px; flex: 5; margin-left: 5px">
                <div
                  v-if="
                    messageData.userId !== 'GSG1' &&
                    messageData.userId !== 'GSG10' &&
                    messageData.userId !== 'GSG2'
                  "
                >
                  <b style="font-size: 16px">{{ messageData.userName }}</b>
                </div>
                <div v-else-if="messageData.userId === 'GSG1'">
                  <b style="font-size: 16px"
                    >{{ messageData.userName }} &nbsp;&nbsp;</b
                  >
                  <b style="font-size: 14px; color: red">作者【</b>
                  <b style="font-size: 14px; color: red" class="el-icon-medal-1"
                    >摸鱼大师】</b
                  >
                </div>
                <div v-else-if="messageData.userId === 'GSG2'">
                  <b style="font-size: 16px"
                    >{{ messageData.userName }} &nbsp;&nbsp;</b
                  >
                  <b style="color: blue">🐋</b>
                </div>
                <div v-else>
                  <b style="font-size: 16px"
                    >{{ messageData.userName }} &nbsp;&nbsp;</b
                  >
                  <b style="color: #ffd700">🌙</b>
                </div>
                <div style="color: black; margin-top: 12px">
                  <span>{{ messageData.content }}</span>
                </div>
                <div style="color: #888; font-size: 14px">
                  <span>{{ messageData.gmtCreate }}</span>
                  <el-button
                    type="text"
                    style="margin-left: 20px; color: black"
                    @click="reply(messageData.id, index)"
                    >回复</el-button
                  >
                  <el-popconfirm
                    v-if="messageData.userId === form.userId"
                    title="你确定删除此评论吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(messageData.id)"
                    @cancel="cancelEvent"
                  >
                    <template #reference>
                      <el-button
                        type="text"
                        style="margin-left: 20px"
                        icon="el-icon-delete"
                      ></el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <div v-if="messageData.reply === true">
                  <el-form
                    :inline="true"
                    :model="form"
                    class="demo-form-inline"
                  >
                    <el-form-item
                      :label="'回复' + messageData.userName + '：'"
                      prop="content"
                    >
                      <el-input
                        v-model="form.content"
                        style="letter-spacing: 5px"
                        placeholder="diss一下吧"
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="cancelReply(index)">取消</el-button>
                      <el-button type="primary" @click="replyMessage(index)"
                        >确定</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>

                <div v-if="messageData.total !== 0">
                  <div v-if="!messageData.openAndClose">
                    <el-button
                      type="text"
                      style="color: black"
                      @click="open(index)"
                      >—————展开{{ messageData.total }}条回复<el-icon
                        class="el-icon-arrow-right"
                      />
                    </el-button>
                  </div>

                  <div v-else>
                    <div
                      v-for="children in messageData.children"
                      :key="children.id"
                      style="display: flex; padding: 2px"
                    >
                      <div style="text-align: left">
                        <div class="block">
                          <el-avatar
                            :size="40"
                            :src="children.avatar"
                          ></el-avatar>
                        </div>
                      </div>
                      <div style="margin-left: 10px">
                        <div v-if="children.userNameByReply === null">
                          <div
                            v-if="
                              children.userId !== 'GSG1' &&
                              children.userId !== 'GSG10' &&
                              children.userId !== 'GSG2'
                            "
                          >
                            <b style="font-size: 16px">{{
                              children.userName
                            }}</b>
                          </div>
                          <div v-else-if="children.userId === 'GSG1'">
                            <b style="font-size: 16px"
                              >{{ children.userName }} &nbsp;&nbsp;</b
                            >
                            <b style="font-size: 14px; color: red">作者【</b>
                            <b
                              style="font-size: 14px; color: red"
                              class="el-icon-medal-1"
                              >摸鱼大师】</b
                            >
                          </div>
                          <div v-else-if="children.userId === 'GSG2'">
                            <b style="font-size: 16px"
                              >{{ children.userName }} &nbsp;&nbsp;</b
                            >
                            <b style="color: blue">🐋</b>
                          </div>
                          <div v-else>
                            <b style="font-size: 16px"
                              >{{ children.userName }} &nbsp;&nbsp;</b
                            >
                            <b style="color: #ffd700">🌙</b>
                          </div>
                        </div>
                        <div v-else>
                          <div v-if="children.userId !== 'GSG1'">
                            <b style="font-size: 14px">{{
                              children.userName
                            }}</b>
                            <b style="color: #87ceeb; margin-left: 10px"
                              >回复</b
                            >
                            <b
                              v-if="
                                children.beCommentedUserId !== 'GSG1' &&
                                children.beCommentedUserId !== 'GSG10' &&
                                children.beCommentedUserId !== 'GSG2'
                              "
                            >
                              <b style="margin-left: 10px">{{
                                children.userNameByReply
                              }}</b>
                            </b>
                            <b
                              v-else-if="children.beCommentedUserId === 'GSG1'"
                            >
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="font-size: 14px; color: red">作者【</b>
                              <b
                                style="font-size: 14px; color: red"
                                class="el-icon-medal-1"
                                >摸鱼大师】</b
                              >
                            </b>
                            <b
                              v-else-if="children.beCommentedUserId === 'GSG2'"
                            >
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="color: blue">🐋</b>
                            </b>
                            <b v-else>
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="color: #ffd700">🌙</b>
                            </b>
                          </div>
                          <div v-else>
                            <b style="font-size: 16px"
                              >{{ children.userName }} &nbsp;&nbsp;</b
                            >
                            <b style="font-size: 14px; color: red">作者【</b>
                            <b
                              style="font-size: 14px; color: red"
                              class="el-icon-medal-1"
                              >摸鱼大师】</b
                            >
                            <b style="color: #87ceeb; margin-left: 10px"
                              >回复</b
                            >
                            <b
                              v-if="
                                children.beCommentedUserId !== 'GSG1' &&
                                children.beCommentedUserId !== 'GSG10' &&
                                children.beCommentedUserId !== 'GSG2'
                              "
                            >
                              <b style="margin-left: 10px">{{
                                children.userNameByReply
                              }}</b>
                            </b>
                            <b
                              v-else-if="children.beCommentedUserId === 'GSG1'"
                            >
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="font-size: 14px; color: red">作者【</b>
                              <b
                                style="font-size: 14px; color: red"
                                class="el-icon-medal-1"
                                >摸鱼大师】</b
                              >
                            </b>
                            <b
                              v-else-if="children.beCommentedUserId === 'GSG2'"
                            >
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="color: blue">🐋</b>
                            </b>
                            <b v-else>
                              <b style="margin-left: 10px"
                                >{{ children.userNameByReply }} &nbsp;&nbsp;</b
                              >
                              <b style="color: #ffd700">🌙</b>
                            </b>
                          </div>
                        </div>
                        <div style="color: black; margin-top: 12px">
                          <span>{{ children.content }}</span>
                        </div>
                        <div style="color: #888; font-size: 14px">
                          <span>{{ children.gmtCreate }}</span>
                          <el-button
                            type="text"
                            style="margin-left: 20px; color: black"
                            @click="replyUser(children)"
                            >回复</el-button
                          >
                          <el-popconfirm
                            v-if="children.userId === form.userId"
                            title="你确定删除此评论吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="handleDelete(children.id)"
                            @cancel="cancelEvent"
                          >
                            <template #reference>
                              <el-button
                                type="text"
                                style="margin-left: 20px"
                                icon="el-icon-delete"
                              ></el-button>
                            </template>
                          </el-popconfirm>
                        </div>
                        <div v-if="children.replyUser">
                          <el-form
                            :inline="true"
                            :model="form"
                            class="demo-form-inline"
                          >
                            <el-form-item
                              :label="'回复' + children.userName + '：'"
                              prop="content"
                            >
                              <el-input
                                v-model="form.content"
                                style="letter-spacing: 5px"
                                placeholder="diss一下吧"
                              ></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button @click="cancelReplyUser(children)"
                                >取消</el-button
                              >
                              <el-button
                                type="primary"
                                @click="ReplyUserMessage(children)"
                                >确定</el-button
                              >
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                    </div>
                    <el-button
                      type="text"
                      style="color: black"
                      @click="close(index)"
                      >———收起<el-icon class="el-icon-arrow-up" />
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>


<script lang="ts">
import post from "@/http/axios";
import { ElMessage } from "element-plus";
import { Base64 } from "js-base64";
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { ElLoading } from "element-plus";

export default defineComponent({
  components: {},
  props: {},
  setup() {
    const handleChange = () => {};
    // 页面数据
    const state = reactive({
      messageData: [
        {
          reply: false,
          // 展开与收起
          openAndClose: false,
          children: [
            {
              reply: false,
            },
          ],
        },
      ],
      saveData: {
        userId: "",
        parentId: "",
        content: "",
      },
      form: {
        userId: "",
        parentId: "",
        content: "",
      },
      rules: {
        content: [
          {
            required: true,
            message: "回复内容不能为空",
            trigger: "blur",
          },
        ],
      },
      index: 1,
      size: 20,
      isLoading: false,
    });
    // 方法体
    const methods = {
      save() {
        request.saveMessage();
      },
      // 回复
      reply(id, index) {
        state.messageData[index].reply = true;
        state.form.parentId = id;
      },
      // 取消回复
      cancelReply(index) {
        state.messageData[index].reply = false;
      },
      // 确定回复
      replyMessage(index) {
        request.addMessage();
        state.messageData[index].reply = false;
      },
      // 二级回复
      replyUser(children) {
        children.replyUser = true;
        state.form.parentId = children.id;
      },
      // 取消二级回复
      cancelReplyUser(children) {
        children.replyUser = false;
      },
      // 确定二级回复
      ReplyUserMessage(children) {
        request.addMessage();
        children.replyUser = false;
      },
      // 取消删除
      cancelEvent() {},
      // 确定删除
      handleDelete(id) {
        request.delete(id);
      },
      // 展开
      open(index) {
        state.messageData[index].openAndClose = true;
      },
      // 关闭
      close(index) {
        state.messageData[index].openAndClose = false;
      },
      scroll() {
        // window.onscroll = () => {
        // 距离底部200px时加载一次
        let bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200;
        if (bottomOfWindow && state.isLoading == false) {
          state.isLoading = true;
          state.index += 1;
          ElLoading.service({ fullscreen: true });
          // 请求体数据
          const data = {
            customData: {
              page: {
                index: state.index,
                size: state.size,
              },
            },
          };
          // post请求
          post("/shuaigang/v1/message/findAllMessage", data).then(
            (res: any) => {
              let { code, message, customData } = res;
              if (message === "OK" && code === 200) {
                for (let i = 0; i < customData.length; i++) {
                  state.messageData.push(customData[i]);
                }
                nextTick(() => {
                  ElLoading.service({ fullscreen: true }).close();
                });
                if (customData.length === state.size) {
                  state.isLoading = false;
                }
              }
            }
          );
        }
        // };
      },
    };
    // 页面默认请求
    onMounted(() => {
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId) {
        state.form.userId = Base64.decode(userId);
        state.saveData.userId = Base64.decode(userId);
      }
      request.findMessage();
      window.addEventListener("scroll", methods.scroll);
      // methods.scroll();
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", methods.scroll, false);
    });
    // 请求
    const request = {
      saveMessage() {
        // 请求体数据
        const data = {
          customData: state.saveData,
        };
        // post请求
        post("/shuaigang/v1/message/releaseMessage", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 4006) {
            state.form.userId = "";
            state.saveData.userId = "";
            localStorage.setItem("token", "");
            localStorage.setItem("shuaigangOVO", "");
            localStorage.setItem("shuaigangQWQ", "");
            window.location.reload();
            ElMessage.error(message);
          } else if (code === 200) {
            ElMessage.success(message);
            state.saveData.content = "";
            state.saveData.parentId = "";
            state.saveData.content = "";
            request.findMessage();
          } else if (message === "userId不能为空！") {
            state.form.userId = "";
            state.saveData.userId = "";
            localStorage.setItem("token", "");
            localStorage.setItem("shuaigangOVO", "");
            localStorage.setItem("shuaigangQWQ", "");
            window.location.reload();
            ElMessage.warning("登录已失效，用户ID不能为空！");
          } else if (message === "内容不能为空！") {
            ElMessage.warning("评论内容不能为空！");
          } else if (code === 4001) {
            ElMessage.warning("未登录，请登录后进行操作！");
          }
        });
      },
      addMessage() {
        // 请求体数据
        const data = {
          customData: state.form,
        };
        // post请求
        post("/shuaigang/v1/message/releaseMessage", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 4006) {
            state.form.userId = "";
            state.saveData.userId = "";
            localStorage.setItem("token", "");
            localStorage.setItem("shuaigangOVO", "");
            localStorage.setItem("shuaigangQWQ", "");
            window.location.reload();
            ElMessage.error(message);
          } else if (code === 200) {
            ElMessage.success(message);
            state.form.content = "";
            state.form.parentId = "";
            state.form.content = "";
            request.findMessage();
          } else if (message === "userId不能为空！") {
            state.form.userId = "";
            state.saveData.userId = "";
            localStorage.setItem("token", "");
            localStorage.setItem("shuaigangOVO", "");
            localStorage.setItem("shuaigangQWQ", "");
            window.location.reload();
            ElMessage.warning("登录已失效，用户ID不能为空！");
          } else if (code === 4001) {
            ElMessage.warning("未登录，请登录后进行操作！");
          } else {
            ElMessage.warning(message);
          }
        });
      },
      findMessage() {
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
        post("/shuaigang/v1/message/findAllMessage", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            state.messageData = customData;
            state.isLoading = false;
          }
        });
      },
      delete(id) {
        // 请求体数据
        const data = {
          customData: {
            id: id,
          },
        };
        // post请求
        post("/shuaigang/v1/message/deletedMessage", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.findMessage();
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), handleChange };
  },
});
</script>

<style scoped>
.message {
  margin: 90px 4% 180px 4%;
}

:deep(.el-card__body) {
  width: 100% !important;
}
</style>
