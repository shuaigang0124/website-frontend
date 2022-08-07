<template>
  <el-config-provider :locale="locale">
    <app />
  </el-config-provider>
  <div class="detail">
    <el-container>
      <el-header class="detail-header">
        <el-row>
          <el-col :span="5">
            <div style="color: white; text-align: right; font-size: 24px">
              隔江明月照莲华<b style="margin-left: 6px">|</b>
            </div>
          </el-col>
          <el-col :span="15">
            <div
              style="
                color: white;
                margin-top: 5px;
                margin-left: 10px;
                text-align: left;
                font-size: 16px;
              "
            >
              文章详情
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
        <div align="left">
          <div style="font-size: 20px; color: #808000">
            <el-row>
              <el-col :span="5" align="right" style="font-size: 20px"
                >{{ detail.title }} <b style="margin-left: 5px">|</b></el-col
              >
              <el-col
                :span="19"
                align="left"
                style="margin-top: 7px; font-size: 14px"
                ><i style="margin-left: 10px">{{
                  detail.titleDescribe
                }}</i></el-col
              >
            </el-row>
          </div>
        </div>
        <el-divider style="margin-top: 10px"></el-divider>
        <el-row :gutter="100" style="margin-left: 2%; margin-right: 2%">
          <el-col :span="17" align="left">
            <div v-html="detail.content"></div>
          </el-col>
          <el-col :span="7">
            <el-calendar v-model="value"> </el-calendar>
            <div align="left" style="margin-top: 20px">
              <div style="font-size: 18px">相关文章</div>
              <el-divider style="margin-top: 10px"></el-divider>
              <div style="margin-left: 15px">
                <div
                  v-for="(sharingLink, index) in sharingLink"
                  :key="sharingLink"
                >
                  <div @click="sharingLinkOpen(index)">
                    <el-button type="text">
                      {{ sharingLink.titleDescribe }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div style="margin-top: 80px">作者：{{ detail.userName }}</div>
        <el-button
          style="margin-top: 15px"
          type="success"
          round
          @click="UpdateClick"
          v-if="clickState == 0"
          >点赞（{{ detail.clickNum }}）</el-button
        >
        <el-button
          style="margin-top: 15px"
          type="warning"
          round
          @click="UpdateClick"
          v-else
          >取消（{{ detail.clickNum }}）</el-button
        >
        <el-divider
          style="margin-top: 20px; background-color: red"
        ></el-divider>
        <!-- 一下为评论 -->
        <div style="width: 60%; margin: 10px auto">
          <h3 align="left">发表评论</h3>
          <el-row>
            <el-col :span="3" align="center" style="margin-top: 20px">
              <el-avatar :size="50" :src="user.avatar"></el-avatar>
            </el-col>
            <el-col :span="21" align="left">
              <el-input
                v-model="insertData.content"
                style="border-radius: 10px"
                placeholder="高低整两句吧！"
                clearable
                :rows="4"
                type="textarea"
              />
              <div align="right" style="margin-top: 15px">
                <el-button
                  style="
                    border-radius: 20px;
                    background-color: #87cefa;
                    width: 100px;
                  "
                  @click="insertComment"
                  >发表</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-divider
            style="margin-top: 20px; background-color: black"
          ></el-divider>
          <div v-if="detail.commentTotal">
            <h4 align="left">评论列表（{{ detail.commentTotal }}条）</h4>
            <div
              v-for="(commentData, index) in commentData"
              :key="commentData"
              style="margin-top: 15px"
            >
              <el-row>
                <el-col :span="2" style="margin-top: 10px">
                  <div style="text-align: right; margin-right: 10px">
                    <el-avatar :size="50" :src="commentData.avatar"></el-avatar>
                  </div>
                </el-col>
                <el-col :span="22" align="left">
                  <div v-if="detail.userId !== commentData.userId">
                    <b style="font-size: 14px">{{ commentData.userName }}</b>
                  </div>
                  <div v-else>
                    <b style="font-size: 14px">{{ commentData.userName }} </b>
                    <b style="font-size: 12px; margin-left: 10px; color: red"
                      >作者【</b
                    >
                    <b
                      style="font-size: 12px; color: red"
                      class="el-icon-medal-1"
                      >优质打工人】</b
                    >
                  </div>
                  <div style="margin-top: 10px; color: #888">
                    <span>{{ commentData.content }}</span>
                  </div>
                  <el-row style="color: #888">
                    <el-col :span="12" align="left">
                      <span>{{ commentData.gmtCreate }}</span>
                      <el-popconfirm
                        v-if="commentData.userId === user.id"
                        title="你确定删除此评论吗？"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        @confirm="handleDelete(commentData.id)"
                        @cancel="cancelEvent"
                      >
                        <template #reference>
                          <el-button
                            type="text"
                            style="margin-left: 10px"
                            icon="el-icon-delete"
                          ></el-button>
                        </template>
                      </el-popconfirm>
                    </el-col>
                    <el-col :span="12" align="right">
                      <el-button
                        type="text"
                        icon="el-icon-chat-line-square"
                        style="color: #000000"
                        @click="reply(commentData.id, index)"
                        >回复</el-button
                      >
                      <el-button
                        type="text"
                        icon="el-icon-thumb"
                        style="color: #000000"
                        v-if="commentData.clickState == 0"
                        @click="click(commentData.id, index)"
                        >点赞（{{ commentData.clickNum }}）</el-button
                      >
                      <el-button
                        type="text"
                        icon="el-icon-thumb"
                        style="color: blue"
                        v-else
                        @click="click(commentData.id, index)"
                        >取消（{{ commentData.clickNum }}）</el-button
                      >
                    </el-col>
                    <div v-if="commentData.reply === true">
                      <el-form
                        :inline="true"
                        :model="form"
                        class="demo-form-inline"
                      >
                        <el-form-item
                          :label="'回复' + commentData.userName + '：'"
                          prop="content"
                        >
                          <el-input
                            v-model="form.content"
                            placeholder="diss一下吧"
                          ></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button @click="cancelReply(index)"
                            >取消</el-button
                          >
                          <el-button type="primary" @click="replyMessage(index)"
                            >确定</el-button
                          >
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-row>

                  <div v-if="commentData.total !== 0">
                    <div v-if="!commentData.openAndClose">
                      <el-button
                        type="text"
                        style="color: black"
                        @click="open(index)"
                        >—————展开{{ commentData.total }}条回复<el-icon
                          class="el-icon-arrow-right"
                        />
                      </el-button>
                    </div>
                    <div v-else>
                      <!-- 子评论 -->
                      <div
                        v-for="children in commentData.children"
                        :key="children"
                        style="display: flex; padding: 2px"
                      >
                        <div style="text-align: left">
                          <el-avatar
                            :size="35"
                            :src="children.avatar"
                          ></el-avatar>
                        </div>
                        <div style="margin-left: 10px; width: 100%">
                          <div v-if="children.userNameByReply === null">
                            <div v-if="detail.userId !== children.userId">
                              <b style="font-size: 14px">{{
                                children.userName
                              }}</b>
                            </div>
                            <div v-else>
                              <b style="font-size: 14px"
                                >{{ children.userName }}
                              </b>
                              <b
                                style="
                                  font-size: 12px;
                                  margin-left: 10px;
                                  color: red;
                                "
                                >作者【</b
                              >
                              <b
                                style="font-size: 12px; color: red"
                                class="el-icon-medal-1"
                                >优质打工人】</b
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div v-if="detail.userId !== children.userId">
                              <b style="font-size: 14px">{{
                                children.userName
                              }}</b>
                              <b style="color: #87ceeb; margin-left: 10px"
                                >回复</b
                              >
                              <b
                                v-if="
                                  detail.userId !== children.beCommentedUserId
                                "
                              >
                                <b style="font-size: 14px; margin-left: 10px">{{
                                  children.userNameByReply
                                }}</b>
                              </b>
                              <b v-else>
                                <b style="font-size: 14px; margin-left: 10px"
                                  >{{ children.userNameByReply }}
                                </b>
                                <b
                                  style="
                                    font-size: 12px;
                                    margin-left: 10px;
                                    color: red;
                                  "
                                  >作者【</b
                                >
                                <b
                                  style="font-size: 12px; color: red"
                                  class="el-icon-medal-1"
                                  >优质打工人】</b
                                >
                              </b>
                            </div>
                            <div v-else>
                              <b style="font-size: 14px; font-size: 14px"
                                >{{ children.userName }}
                              </b>
                              <b
                                style="
                                  font-size: 12px;
                                  margin-left: 10px;
                                  color: red;
                                "
                                >作者【</b
                              >
                              <b
                                style="font-size: 12px; color: red"
                                class="el-icon-medal-1"
                                >优质打工人】</b
                              >
                              <b style="color: #87ceeb; margin-left: 10px"
                                >回复</b
                              >
                              <b
                                v-if="
                                  detail.userId !== children.beCommentedUserId
                                "
                              >
                                <b style="margin-left: 10px">{{
                                  children.userNameByReply
                                }}</b>
                              </b>
                              <b v-else>
                                <b style="font-size: 14px; margin-left: 10px"
                                  >{{ children.userNameByReply }}
                                </b>
                                <b
                                  style="
                                    font-size: 12px;
                                    margin-left: 10px;
                                    color: red;
                                  "
                                  >作者【</b
                                >
                                <b
                                  style="font-size: 12px; color: red"
                                  class="el-icon-medal-1"
                                  >优质打工人】</b
                                >
                              </b>
                            </div>
                          </div>

                          <div style="margin-top: 5px; color: #888">
                            <span>{{ children.content }}</span>
                          </div>
                          <el-row style="color: #888">
                            <el-col :span="12" align="left">
                              <span>{{ children.gmtCreate }}</span>
                              <el-popconfirm
                                v-if="children.userId === user.id"
                                title="你确定删除此评论吗？"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                @confirm="handleDelete(children.id)"
                                @cancel="cancelEvent"
                              >
                                <template #reference>
                                  <el-button
                                    type="text"
                                    style="margin-left: 10px"
                                    icon="el-icon-delete"
                                  ></el-button>
                                </template>
                              </el-popconfirm>
                            </el-col>
                            <el-col :span="12" align="right">
                              <el-button
                                type="text"
                                icon="el-icon-chat-line-square"
                                style="color: #000000"
                                @click="replyUser(children)"
                                >回复</el-button
                              >
                              <el-button
                                type="text"
                                icon="el-icon-thumb"
                                style="color: #000000"
                                v-if="children.clickState == 0"
                                @click="childrenClick(children)"
                                >点赞（{{ children.clickNum }}）</el-button
                              >
                              <el-button
                                type="text"
                                icon="el-icon-thumb"
                                style="color: blue"
                                v-else
                                @click="childrenClick(children)"
                                >取消（{{ children.clickNum }}）</el-button
                              >
                            </el-col>

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
                          </el-row>
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
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else>
            <div align="center" style="margin-top: 40px">
              暂无评论哦，快来评论一下吧！
            </div>
          </div>
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
import { useRoute } from "vue-router";
import post from ".././http/axios/index";
import { ElConfigProvider, ElMessage } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { Base64 } from "js-base64";
import router from "@/router";
import message from "element-plus/lib/el-message/src/message";
export default defineComponent({
  components: {
    ElConfigProvider,
  },
  props: {},
  setup() {
    const route = useRoute();
    // 页面数据
    const state = reactive({
      clickState: 0,
      userId: "",
      detailfooter: {
        link2: "https://beian.miit.gov.cn",
      },
      // new Date()
      value: "",
      // 评论数据
      commentData: [
        {
          clickNum: "",
          openAndClose: false,
          reply: false,
          clickState: 0,
          children: [
            {
              clickNum: "",
              replyUser: false,
              clickState: 0,
            },
          ],
        },
      ],
      // 用户登录数据
      user: {
        id: "",
        avatar: "",
        userName: "",
      },
      // 日常分享详情
      detail: {
        userId: "",
        userName: "",
        clickNum: 0,
        commentTotal: 0,
        gmtCreate: "",
      },
      // 通过tag查询相关的帖子
      sharingLink: [
        {
          id: "",
          titleDescribe: "",
        },
      ],
      // 新增评论
      insertData: {
        userId: "",
        content: "",
        parentId: "",
        sharingId: route.query.id,
      },
      // 评论回复
      form: {
        userId: "",
        content: "",
        parentId: "",
        sharingId: "",
      },
      // 点赞
      updateData: {
        id: "",
        clickNum: 0,
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
      // 打开其它相同tag的分享页
      sharingLinkOpen(index) {
        let id = state.sharingLink[index].id;
        let jump = router.resolve({
          path: "/detail",
          query: { id },
        });
        window.open(jump.href, "_blank");
      },
      // 点赞
      UpdateClick() {
        let clickNum = state.detail.clickNum;
        state.updateData.clickNum = clickNum;
        if (state.userId !== null && state.userId !== "") {
          request.updateByCondition();
        } else {
          ElMessage.warning("请登录后进行操作");
        }
      },
      // 新增评论
      insertComment() {
        // console.log(state.insertData);
        request.insertComment();
      },
      // 展开
      open(index) {
        state.commentData[index].openAndClose = true;
      },
      // 关闭
      close(index) {
        state.commentData[index].openAndClose = false;
      },
      // 取消删除
      cancelEvent() {},
      // 确定删除
      handleDelete(id) {
        request.delete(id);
      },
      // 回复
      reply(id, index) {
        state.commentData[index].reply = true;
        state.form.parentId = id;
      },
      // 点赞
      click(id, index) {
        let clickNum = state.commentData[index].clickNum;
        request.update(id, clickNum);
      },
      // 取消回复
      cancelReply(index) {
        state.commentData[index].reply = false;
      },
      // 确定回复
      replyMessage(index) {
        request.addComment();
        state.commentData[index].reply = false;
      },
      // 二级回复
      replyUser(children) {
        children.replyUser = true;
        state.form.parentId = children.id;
      },
      // 点赞
      childrenClick(children) {
        // children.clickNum = children.clickNum + 1;
        request.update(children.id, children.clickNum);
      },
      // 取消二级回复
      cancelReplyUser(children) {
        children.replyUser = false;
      },
      // 确定二级回复
      ReplyUserMessage(children) {
        request.addComment();
        children.replyUser = false;
      },
    };
    // 页面默认请求
    onMounted(() => {
      request.getSharingDetail();
      let userId = localStorage.getItem("shuaigangOVO");
      if (userId) {
        state.form.userId = Base64.decode(userId);
        state.userId = Base64.decode(userId);
        state.insertData.userId = Base64.decode(userId);
        let id = Base64.decode(userId);
        request.getUserDetails(id);
      }
      // console.log(route);
      console.log(route.query.id);
    });
    // 请求
    const request = {
      // 查询用户点赞状态
      findKudos() {
        const data = {
          customData: {
            userId: state.userId,
            serviceId: state.updateData.id,
          },
        };
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { customData } = res;
            state.clickState = customData;
          }
        );
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
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
          }
        });
      },
      getSharingDetail() {
        // 请求体数据
        const data = {
          customData: {
            id: route.query.id,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, customData } = res;
            if (code === 200) {
              state.detail = customData;
              state.value = customData.gmtCreate;
              state.form.sharingId = customData.id;
              state.updateData.id = customData.id;
              request.findKudos();
              request.getList();
              request.getSharingByTag(customData.id, customData.tagId);
            }
          }
        );
      },
      updateByCondition() {
        // 请求体数据
        const data = {
          customData: {
            sharingId: state.updateData.id,
            userId: state.userId,
            clickNum: state.updateData.clickNum,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code == 4006) {
              state.user.id = "";
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.warning(message);
            } else if (code === 200) {
              ElMessage.success(message);
              request.getSharingDetail();
            } else {
              ElMessage.warning(message);
            }
          }
        );
      },
      getSharingByTag(id, tagId) {
        // 请求体数据
        const data = {
          customData: {
            sharingId: id,
            tagId,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            state.sharingLink = customData;
          }
        });
      },

      // 评论板块请求
      // 新增评论
      insertComment() {
        // 请求体数据
        const data = {
          customData: state.insertData,
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code === 200) {
              ElMessage.success(message);
              state.insertData.content = "";
              state.form.parentId = "";
              state.form.content = "";
              if (state.detail.commentTotal < 1) {
                location.reload();
              }
              request.getList();
            } else if (code == 4006) {
              state.user.id = "";
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.error(message);
            } else if (code == 4001) {
              ElMessage.warning("请登录后进行操作");
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      // 获取评论列表
      getList() {
        // 请求体数据
        const data = {
          customData: {
            sharingId: route.query.id,
            userId: state.userId,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, customData } = res;
            if (code === 200) {
              state.commentData = customData;
            }
          }
        );
      },
      // 评论回复
      addComment() {
        // 请求体数据
        const data = {
          customData: state.form,
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message } = res;
            if (code === 200) {
              ElMessage.success(message);
              state.form.content = "";
              state.form.parentId = "";
              state.form.content = "";
              request.getList();
            } else if (code === 4006) {
              state.user.id = "";
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.error(message);
            } else if (code == 4001) {
              ElMessage.warning("请登录后进行操作");
            } else {
              ElMessage.warning(message);
            }
          }
        );
      },
      // 点赞
      update(id, clickNum) {
        // 请求体数据
        const data = {
          customData: {
            id: id,
            clickNum: clickNum,
            userId: state.userId,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code == 4006) {
              state.user.id = "";
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.warning(message);
            } else if (code == 4001) {
              ElMessage.warning("请登录后进行操作");
            } else if (code === 200) {
              ElMessage.success(message);
              request.getList();
            } else {
              ElMessage.warning(message);
            }
          }
        );
      },
      // 删除评论
      delete(id) {
        // 请求体数据
        const data = {
          customData: {
            id: id,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code === 200) {
              ElMessage.success(message);
              request.getList();
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
    };
    return { ...methods, ...toRefs(state), locale: zhCn };
  },
});
</script>

<style scoped>
.el-calendar {
  --el-calendar-cell-width: 3vw !important;
}
.el-calendar {
  --el-calendar-selected-background-color: #87ceeb;
}

.detail-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.detail-main {
  height: calc(100vh - 120px);
  background-color: #ebf7f4;
  color: #333;
  text-align: center;
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
:deep(.el-calendar__button-group) {
  display: none !important;
}
.el-user-welcome {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>

