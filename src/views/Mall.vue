<template>
  <el-main id="mall">
    <div class="mall">
      <el-divider content-position="left">积分抽奖</el-divider>
      <el-row>
        <el-col :span="12" align="center">
          <div style="font-size: 18px">
            活动名称：{{ activityData[index].activityName }}
          </div>
          <div style="margin-bottom: 5px">
            <el-button type="text" v-if="index !== 0" @click="sub"
              >切换到上一个活动</el-button
            >
            <el-button type="text" v-else disabled>切换到上一个活动</el-button>
            <el-button
              type="text"
              v-if="activityData.length !== index + 1"
              @click="add"
              >切换到下一个活动</el-button
            >
            <el-button type="text" v-else disabled>切换到下一个活动</el-button>
          </div>
          <div class="block">
            <el-image
              :src="activityData[index].prizeImg"
              style="width: 50%"
            ></el-image>
          </div>
          <div style="font-size: 15px; margin-top: 10px">
            <i>发起人：{{ activityData[index].reUserName }}</i>
          </div>
          <div style="font-size: 15px; margin-top: 8px">
            奖品：{{ activityData[index].prizeName }}
          </div>
          <div
            v-if="activityData[index].isEnabled === 0"
            style="font-size: 15px; margin-top: 8px"
          >
            （{{ activityData[index].partPoint }}积分参与）
          </div>
          <div v-else style="font-size: 15px; margin-top: 8px">
            恭喜用户【<i style="color: blue">{{
              activityData[index].prizeUserName
            }}</i
            >】中奖
          </div>
          <div
            style="
              font-size: 14px;
              color: var(--el-text-color-secondary);
              margin-top: 5px;
            "
          >
            开奖时间：{{ activityData[index].gmtTime }}
          </div>
          <div style="margin-top: 10px">
            <el-button
              v-if="
                activityData[index].isEnabled === 0 &&
                activityData[index].userJoinNum === 0 &&
                activityData[index].userId !== userId
              "
              circle
              type="danger"
              style="width: 90px; height: 90px"
              @click="goToLottery"
              >参与抽奖</el-button
            >
            <el-button
              v-else-if="
                activityData[index].isEnabled === 0 &&
                activityData[index].userJoinNum === 1 &&
                activityData[index].userId !== userId
              "
              disabled
              circle
              round
              type="danger"
              style="width: 90px; height: 90px"
              >已参与</el-button
            >
            <el-button
              v-else-if="
                activityData[index].isEnabled === 0 &&
                activityData[index].userId === userId
              "
              circle
              round
              type="danger"
              style="width: 90px; height: 90px"
              @click="openLottery"
              >立即开奖</el-button
            >
            <el-button
              v-else-if="activityData[index].isEnabled === 1"
              disabled
              circle
              round
              type="danger"
              style="width: 90px; height: 90px"
              >已结束</el-button
            >
            <el-button
              v-else
              circle
              round
              type="danger"
              style="width: 90px; height: 90px"
              @click="goToLottery"
              >参与抽奖</el-button
            >
            <div
              style="
                font-size: 14px;
                color: var(--el-text-color-secondary);
                margin-top: 3px;
              "
            >
              已有{{ activityData[index].peopleNum }}人参与
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-top: 10%">
            <b>抽奖说明：</b>
          </div>
          <div style="margin-left: 5%">
            每日签到可领取积分（需注册登录），积分可用于抽奖或者兑换礼品；
          </div>
          <div style="margin-left: 5%">
            中奖请添加QQ群（664326493）联系群主，超过24小时未联系视为放弃领取；
          </div>
          <div style="margin-left: 5%">抽奖试运行，最终解释权归作者所有。</div>
        </el-col>
      </el-row>
      <div align="right">
        <el-button @click="but1">每日签到</el-button>
        <el-button @click="but2">个人兑换记录</el-button>
        <el-button v-if="role === '管理员'" @click="but3"
          >商家兑换处理</el-button
        >
        <el-button v-if="userId === 'GSG1'" @click="but4"
          >所有兑换记录</el-button
        >
        <el-button v-if="role === '管理员'" @click="but5">发布商品</el-button>
        <el-button v-if="role === '管理员'" @click="but01">发起抽奖</el-button>
        <el-button @click="but02">个人中奖记录</el-button>
        <el-button v-if="role === '管理员'" @click="but03"
          >抽奖发起记录</el-button
        >
        <el-button v-if="userId === 'GSG1'" @click="but04"
          >所有活动记录</el-button
        >
      </div>
      <!-- 每日签到 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table1"
        title="签到"
        direction="rtl"
        size="37%"
      >
        <div align="right" style="width: 98%">
          <el-button
            v-if="signNum === 0"
            type="info"
            size="small"
            @click="insertAttendance"
            >每日签到&nbsp;<i class="el-icon-warning-outline"
          /></el-button>
          <el-button v-else type="success" size="small"
            >今日已签&nbsp;<i class="el-icon-success"
          /></el-button>
          <el-button type="primary" size="small"
            >个人积分数：{{ userPointTotal }}</el-button
          >
        </div>
        <div align="center">
          <el-calendar>
            <template #dateCell="{ data }">
              <p>
                {{ data.day.split("-").slice(2).join("-") }}
                <span v-for="dateList in dateList" :key="dateList">
                  {{
                    new Date(data.day).getTime() ===
                    new Date(dateList.dayTime).getTime()
                      ? "✔️"
                      : ""
                  }}
                </span>
              </p>
            </template>
          </el-calendar>
        </div>
        <div style="margin-left: 3%">
          <div>
            签到说明：点击每日签到可获得（2）积分，积分可用于兑换商品和参与抽奖。
          </div>
        </div>
      </el-drawer>
      <!-- 个人兑换记录 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table2"
        title="个人兑换记录"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="recordData"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="tradeName"
            label="商品名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="subNum"
            label="消耗积分"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statusName"
            label="兑换状态"
            width="90"
            :filters="[
              { text: '待处理', value: 0 },
              { text: '已完成', value: 1 },
              { text: '已退回', value: 2 },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
            ><template #default="scope">
              <el-tag
                :type="
                  scope.row.convertStatus === 0
                    ? 'info'
                    : scope.row.convertStatus === 1
                    ? 'success'
                    : 'danger'
                "
                disable-transitions
                >{{ scope.row.statusName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" width="140" />
        </el-table>
      </el-drawer>
      <!-- 商品兑换处理 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table3"
        title="商品兑换处理"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="recordData"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
          highlight-current-row
          @row-click="handleClick"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="tradeName"
            label="商品名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="userName"
            label="用户名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="subNum"
            label="消耗积分"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statusName"
            label="兑换状态"
            width="90"
            :filters="[
              { text: '待处理', value: 0 },
              { text: '已完成', value: 1 },
              { text: '已退回', value: 2 },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
            ><template #default="scope">
              <el-tag
                :type="
                  scope.row.convertStatus === 0
                    ? 'info'
                    : scope.row.convertStatus === 1
                    ? 'success'
                    : 'danger'
                "
                disable-transitions
                >{{ scope.row.statusName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" width="140" />
        </el-table>
        <el-dialog
          v-model="dialogUpdate"
          title="Tips"
          width="30%"
          :before-close="handleClose"
        >
          <span>修改订单状态</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogUpdate = false">取消</el-button>
              <el-button type="primary" @click="wancheng">完成</el-button
              ><el-button type="danger" @click="tuihui">退回</el-button>
            </span>
          </template>
        </el-dialog>
      </el-drawer>
      <!-- 所有兑换记录 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table4"
        title="所有兑换记录"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="recordData"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
          highlight-current-row
          @row-click="handleClick2"
          @current-change="handleCurrentChange2"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="tradeName"
            label="商品名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="userName"
            label="用户名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="subNum"
            label="消耗积分"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statusName"
            label="兑换状态"
            width="90"
            :filters="[
              { text: '待处理', value: 0 },
              { text: '已完成', value: 1 },
              { text: '已退回', value: 2 },
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
            ><template #default="scope">
              <el-tag
                :type="
                  scope.row.convertStatus === 0
                    ? 'info'
                    : scope.row.convertStatus === 1
                    ? 'success'
                    : 'danger'
                "
                disable-transitions
                >{{ scope.row.statusName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="创建时间" width="140" />
        </el-table>
        <el-dialog
          v-model="dialogUpdate2"
          title="Tips"
          width="30%"
          :before-close="handleClose2"
        >
          <span>修改订单状态</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogUpdate2 = false">取消</el-button>
              <el-button type="primary" @click="wancheng2">完成</el-button
              ><el-button type="danger" @click="tuihui2">退回</el-button>
            </span>
          </template>
        </el-dialog>
      </el-drawer>
      <!-- 发布商品信息 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table5"
        title="发布商品信息"
        direction="rtl"
        size="37%"
      >
        <el-form
          ref="formData"
          :model="inputData"
          :rules="rules"
          label-width="100px"
          style="width: 90%"
        >
          <el-form-item label="商品名称：" prop="tradeName">
            <el-input v-model="inputData.tradeName" />
          </el-form-item>
          <el-form-item label="商品数量：" prop="tradeNum">
            <el-input v-model="inputData.tradeNum" />
          </el-form-item>

          <el-form-item label="兑换积分：" prop="pointNum">
            <el-input v-model="inputData.pointNum" />
          </el-form-item>
          <el-form-item label="商品类型：" prop="typeId">
            <el-radio-group v-model="inputData.typeId">
              <el-radio :label="1">电子产品</el-radio>
              <el-radio :label="2">垃圾产品</el-radio>
              <el-radio :label="3">虚拟产品</el-radio>
              <el-radio :label="4">其它</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="商品图片：">
            <el-upload
              class="avatar-uploader"
              action="123"
              :http-request="uploadImg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="inputData.tradeImg"
                :src="inputData.tradeImg"
                class="avatar"
              />
              <div v-else class="avatar-uploader-icon">
                <i class="el-icon-plus" />
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item align="center">
            <span class="dialog-footer">
              <el-button @click="resetForm">取消</el-button>
              <el-button type="primary" @click="determineInsert"
                >确定</el-button
              >
            </span>
          </el-form-item>
        </el-form>
      </el-drawer>
      <!-- 发布抽奖活动 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table01"
        title="发布抽奖活动"
        direction="rtl"
        size="37%"
      >
        <el-form
          ref="formData01"
          :model="inputData01"
          :rules="rules"
          label-width="100px"
          style="width: 90%"
        >
          <el-form-item label="活动名称：" prop="activityName">
            <el-input v-model="inputData01.activityName" />
          </el-form-item>
          <el-form-item label="奖品名称：" prop="prizeName">
            <el-input v-model="inputData01.prizeName" />
          </el-form-item>

          <el-form-item label="参与积分：" prop="partPoint">
            <el-input v-model="inputData01.partPoint" />
          </el-form-item>
          <el-form-item label="开奖时间：" prop="gmtTime">
            <el-date-picker
              v-model="inputData01.gmtTime"
              type="datetime"
              placeholder="请选择开奖时间"
              style="width: 100%"
              :disabled-date="disabledDate"
              :editable="false"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="奖品图片：">
            <el-upload
              class="avatar-uploader2"
              action="1234"
              :http-request="uploadImg2"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                style="width: 200px"
                v-if="inputData01.prizeImg"
                :src="inputData01.prizeImg"
              />
              <div v-else class="avatar-uploader-icon2">
                <i class="el-icon-plus" />
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item align="center">
            <span class="dialog-footer">
              <el-button @click="resetForm01">取消</el-button>
              <el-button type="primary" @click="determineInsert01"
                >确定</el-button
              >
            </span>
          </el-form-item>
        </el-form>
      </el-drawer>
      <!-- 个人中奖记录 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table02"
        title="个人中奖记录"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="activityDataList"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="activityName"
            label="活动名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="prizeName"
            label="奖品"
            show-overflow-tooltip
          />
          <el-table-column prop="partPoint" label="消耗积分" />
        </el-table>
      </el-drawer>
      <!-- 我发起的抽奖记录 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table03"
        title="我发起的抽奖记录"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="activityDataList"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="activityName"
            label="活动名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statusName"
            label="活动状态"
            width="90"
            :filters="[
              { text: '进行中', value: 0 },
              { text: '已结束', value: 1 },
            ]"
            :filter-method="filterTag2"
            filter-placement="bottom-end"
            ><template #default="scope">
              <el-tag
                :type="scope.row.isEnabled === 0 ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.statusName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="prizeName"
            label="奖品"
            show-overflow-tooltip
          />
          <el-table-column
            prop="peopleNum"
            label="参与人数"
            show-overflow-tooltip
          />
          <el-table-column
            prop="partPoint"
            label="参与积分"
            show-overflow-tooltip
          />
          <el-table-column
            prop="prizeUserName"
            label="中奖人"
            show-overflow-tooltip
          />
        </el-table>
      </el-drawer>
      <!-- 所有抽奖活动记录 -->
      <el-drawer
        :lock-scroll="false"
        v-model="table04"
        title="所有抽奖活动记录"
        direction="rtl"
        size="37%"
      >
        <el-table
          :data="activityDataList"
          stripe
          style="width: 100%; margin-left: 3%"
          height="90vh"
        >
          <el-table-column type="index" width="60" />
          <el-table-column
            prop="activityName"
            label="活动名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="statusName"
            label="活动状态"
            width="90"
            :filters="[
              { text: '进行中', value: 0 },
              { text: '已结束', value: 1 },
            ]"
            :filter-method="filterTag2"
            filter-placement="bottom-end"
            ><template #default="scope">
              <el-tag
                :type="scope.row.isEnabled === 0 ? 'success' : 'danger'"
                disable-transitions
                >{{ scope.row.statusName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="prizeName"
            label="奖品"
            show-overflow-tooltip
          />
          <el-table-column
            prop="peopleNum"
            label="参与人数"
            show-overflow-tooltip
          />
          <el-table-column
            prop="partPoint"
            label="参与积分"
            show-overflow-tooltip
          />
          <el-table-column
            prop="prizeUserName"
            label="中奖人"
            show-overflow-tooltip
          />
        </el-table>
      </el-drawer>
      <!-- 积分商城 -->
      <el-divider content-position="left">积分兑换</el-divider>
      <el-row>
        <el-col :span="4">
          <el-menu default-active="0" background-color="#ebf7f4">
            <div v-for="tradeType in tradeTypeData" :key="tradeType">
              <el-menu-item
                :index="tradeType.id"
                @click="tradeOpen(tradeType.id)"
              >
                <i :class="tradeType.icon"></i>
                <template #title>{{ tradeType.name }}</template>
              </el-menu-item>
            </div>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <div class="demo-image" style="min-height: 500px">
            <span v-for="fit in fitData" :key="fit">
              <el-card
                class="block"
                @click="
                  convertAction(fit.id, fit.tradeNum, fit.pointNum, fit.typeId)
                "
              >
                <el-image
                  style="width: 120px; height: 120px"
                  :src="fit.tradeImg"
                  fit="fill"
                ></el-image>
                <!-- <span class="demonstration">发布人：{{ fit.userName }}</span> -->
                <span class="demonstration1">{{ fit.tradeName }}</span>
                <span class="demonstration2">{{ fit.pointNum }}积分</span>
                <span class="demonstration2">剩余：{{ fit.tradeNum }}</span>
              </el-card>
            </span>
          </div>
          <div align="center" style="margin-top: 20px">
            <el-pagination
              :currentPage="page.index"
              :page-size="page.size"
              :total="page.totalCount"
              layout="prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleIndexChange"
            >
            </el-pagination>
          </div>
          <el-dialog
            :lock-scroll="false"
            v-model="centerDialogVisible"
            title="你确定兑换该商品吗？"
            width="30%"
            center
          >
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="goConvert">确定</el-button>
              </span>
            </template>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
  </el-main>
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
    const formData = ref();
    const formData01 = ref();
    // 页面数据
    const state = reactive({
      page: {
        index: 1,
        // 计算宽度一排适合显示几个商品*2
        size: Math.floor((23 * document.body.clientWidth - 300) / 5700) * 2,
        totalCount: 0,
      },
      signNum: 0,
      userPointTotal: 0,
      dateList: [
        {
          dayTime: "",
        },
      ],
      userId: "",
      role: "",
      typeId: "",
      dialogUpdate: false,
      dialogUpdate2: false,
      table1: false,
      table2: false,
      table3: false,
      table4: false,
      table5: false,
      table01: false,
      table02: false,
      table03: false,
      table04: false,
      website: {
        img: "1",
        link: "https://www.jeep.com.cn/wrangler/jl/?mz_ca=2253619&mz_sp=7w3sT&mz_sb=1",
        advertising:
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.58cdn.com.cn%2Fp1%2Fbig%2Fn_v2e1813b7c82444346ae52f36e2a2d469c.jpg&refer=http%3A%2F%2Fpic4.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634981915&t=0fafd7d8c17548c5ec832c42cd7722b3",
      },
      fitData: [
        {
          id: "TRA0000000",
          userId: "GSG0000000",
          tradeName: "商品名",
          tradeImg:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          userName: "商家",
          pointNum: 0,
          tradeNum: 0,
        },
      ],
      // url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      index: 0,
      activityData: [
        {
          id: 0,
          userId: "GSG1",
          partPoint: 0,
          activityName: "",
          prizeImg: "",
          prizeName: "",
          prizeUserId: "",
          isEnabled: 0,
          gmtTime: "",
          peopleNum: 0,
          reUserName: "",
          prizeUserName: "",
          userJoinNum: 0,
        },
      ],
      tradeTypeData: [
        {
          id: "0",
          icon: "el-icon-s-goods",
          name: "所有",
        },
        {
          id: "1",
          icon: "el-icon-monitor",
          name: "电子产品",
        },
        {
          id: "2",
          icon: "el-icon-goods",
          name: "垃圾产品",
        },
        {
          id: "3",
          icon: "el-icon-cloudy",
          name: "虚拟产品",
        },
        {
          id: "4",
          icon: "el-icon-shopping-bag-1",
          name: "其它",
        },
      ],
      centerDialogVisible: false,
      tradeConvertData: {
        id: "",
        userId: "",
        pointNum: null,
        tradeNum: null,
        typeId: null,
      },
      recordData: [
        {
          tradeName: "",
          convertStatus: null,
          statusName: "",
          gmtCreate: "",
          subNum: null,
        },
      ],
      activityDataList: [
        {
          activityName: "",
          prizeName: "",
          prizeUserName: "",
          peopleNum: null,
          partPoint: null,
          isEnabled: null,
          statusName: "",
        },
      ],
      inputData: {
        tradeName: "",
        tradeNum: null,
        pointNum: null,
        typeId: null,
        tradeImg: "",
      },
      inputData01: {
        activityName: "",
        prizeName: "",
        partPoint: null,
        gmtTime: "",
        prizeImg: "",
      },
      rules: {
        tradeName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        tradeNum: [
          {
            required: true,
            message: "不能为空且只能是数字",
            trigger: "blur",
            type: "number",
            transform(value) {
              let regex = /^([1-9]\d*|[0]{1,1})$/;
              if (regex.test(value)) {
                return Number(value);
              }
            },
          },
        ],
        pointNum: [
          {
            required: true,
            message: "不能为空且只能是数字",
            trigger: "blur",
            type: "number",
            transform(value) {
              let regex = /^([1-9]\d*|[0]{1,1})$/;
              if (regex.test(value)) {
                return Number(value);
              }
            },
          },
        ],
        typeId: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        activityName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        prizeName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        partPoint: [
          {
            required: true,
            message: "不能为空且只能是数字",
            trigger: "blur",
            type: "number",
            transform(value) {
              let regex = /^([1-9]\d*|[0]{1,1})$/;
              if (regex.test(value)) {
                return Number(value);
              }
            },
          },
        ],
        gmtTime: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
      row: {
        id: "",
        userId: "",
        tradeId: "",
        subNum: null,
        convertStatus: null,
      },
    });
    // 方法体
    const methods = {
      disabledDate(time) {
        return time.getTime() < Date.now() + 60 * 60 * 24;
      },
      linkOpen(link) {
        window.open(link); //新窗口打开链接
      },
      imgChange() {
        this.website.img = "";
      },
      // 活动切换
      add() {
        state.index += 1;
      },
      sub() {
        if (state.index >= 1) {
          state.index -= 1;
        } else {
          state.index = 0;
        }
      },
      // 参与抽奖
      goToLottery() {
        // console.log(state.userId);
        // console.log(state.activityData[state.index].id);
        // console.log(state.activityData[state.index].partPoint);
        request.go();
      },
      // 开奖
      openLottery() {
        const time = new Date(state.activityData[state.index].gmtTime);
        // 开奖时间
        const openTime = time.getTime();
        // console.log(openTime);
        // 当前时间
        var date = new Date();
        const nowTime = date.getTime();
        // console.log(nowTime);
        if (
          nowTime >= openTime &&
          state.userId === state.activityData[state.index].userId
        ) {
          request.openWinner();
        } else {
          ElMessage.warning("未到开奖时间！");
        }
      },
      // 通过index进行查询
      tradeOpen(id) {
        state.page.index = 1;
        state.page.size =
          Math.floor((23 * document.body.clientWidth - 300) / 5700) * 2;
        console.log(state.page.size);
        if (id === "0") {
          state.typeId = "0";
          request.getTrade(null);
        } else {
          state.typeId = id;
          request.getTrade(parseInt(id));
        }
      },
      //分页
      handleSizeChange(size) {
        state.page.size = size;
        request.getTrade(parseInt(state.typeId));
      },
      handleIndexChange(index) {
        state.page.index = index;
        request.getTrade(parseInt(state.typeId));
      },
      // 弹出兑换确认框
      convertAction(id, tradeNum, pointNum, typeId) {
        // console.log(id);
        if (tradeNum >= 1) {
          state.centerDialogVisible = true;
          state.tradeConvertData.id = id;
          state.tradeConvertData.pointNum = pointNum;
          state.tradeConvertData.tradeNum = tradeNum;
          state.tradeConvertData.typeId = typeId;
        } else {
          ElMessage.warning("商品已售罄！");
        }
      },
      // 确认兑换
      goConvert() {
        request.tradeConvert();
        state.centerDialogVisible = false;
      },
      // 每日签到
      but1() {
        if (state.userId === null || state.userId === "") {
          ElMessage.error("请先登录在进行操作");
        } else {
          request.getUserPointTotal();
          request.getUserAttendance();
          // moment(new Date()).format("YYYY-MM-DD")
        }
      },
      // 签到
      insertAttendance() {
        request.insertAttendance();
      },
      // 个人兑换记录
      but2() {
        request.getRecordList(state.userId, "", 2);
      },
      // 商品发货管理
      but3() {
        request.getRecordList("", state.userId, 3);
      },
      handleCurrentChange() {},
      handleCurrentChange2() {},
      // 获取table数据
      handleClick(row) {
        // console.log(row);
        if (row.convertStatus == 0) {
          state.dialogUpdate = true;
          state.row = row;
        } else {
          ElMessage.warning("订单已处理，无法继续操作");
        }
      },
      handleClick2(row) {
        // console.log(row);
        if (row.convertStatus == 0) {
          state.dialogUpdate2 = true;
          state.row = row;
        } else {
          ElMessage.warning("订单已处理，无法继续操作");
        }
      },
      filterTag(row, row2) {
        // console.log(row);
        // console.log(row2);
        return row2.convertStatus === row;
      },
      filterTag2(row, row2) {
        // console.log(row);
        // console.log(row2);
        return row2.isEnabled === row;
      },
      handleClose() {
        state.dialogUpdate = false;
      },
      handleClose2() {
        state.dialogUpdate2 = false;
      },
      wancheng() {
        request.updateRecordStatus(state.row.id, 1, null, null, null, "商家");
        state.dialogUpdate = false;
      },
      wancheng2() {
        request.updateRecordStatus(state.row.id, 1, null, null, null, "帅刚");
        state.dialogUpdate2 = false;
      },
      tuihui() {
        request.updateRecordStatus(
          state.row.id,
          2,
          state.row.userId,
          state.row.tradeId,
          state.row.subNum,
          "商家"
        );
        state.dialogUpdate = false;
      },
      tuihui2() {
        request.updateRecordStatus(
          state.row.id,
          2,
          state.row.userId,
          state.row.tradeId,
          state.row.subNum,
          "帅刚"
        );
        state.dialogUpdate2 = false;
      },
      // 处理所有兑换记录
      but4() {
        request.getRecordList("", "", 4);
      },
      // 发布商品
      but5() {
        state.table5 = true;
      },
      uploadImg(file) {
        let formData: any = new FormData();
        formData.append("multipartFile", file.file);
        formData.append("type", 2);
        request.uploadImg(formData);

        // console.log(file);
        console.log(file.file);
      },
      uploadImg2(file) {
        let formData: any = new FormData();
        formData.append("multipartFile", file.file);
        formData.append("type", 2);
        request.uploadImg2(formData);

        // console.log(file);
        console.log(file.file);
      },
      handleAvatarSuccess() {},
      beforeAvatarUpload(file) {
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
      // 取消发布
      resetForm() {
        request.deleteImg(state.inputData.tradeImg);
        const form = formData.value;
        if (form) form.resetFields();
        state.table5 = false;
      },
      determineInsert() {
        const form = formData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            // console.log(state.inputData);
            request.insertTrade();
          }
        });
      },
      // 发起抽奖活动
      but01() {
        state.table01 = true;
      },
      // 取消发起抽奖活动
      resetForm01() {
        request.deleteImg(state.inputData01.prizeImg);
        const form = formData01.value;
        if (form) form.resetFields();
        state.table01 = false;
      },
      determineInsert01() {
        const form = formData01.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            (state.inputData01.gmtTime = moment(
              state.inputData01.gmtTime
            ).format("YYYY-MM-DD HH:mm:ss")),
              // console.log(state.inputData01);
              request.insertActivity();
          }
        });
      },
      but02() {
        request.getActivityList(1, null, state.userId, 2);
      },
      but03() {
        request.getActivityList(null, state.userId, null, 3);
      },
      but04() {
        request.getActivityList(null, null, null, 4);
      },
    };
    // 页面默认请求
    onMounted(() => {
      console.log(state.page.size);
      let userId = localStorage.getItem("shuaigangOVO");
      let role = localStorage.getItem("shuaigangQWQ");
      if (userId) {
        state.role = Base64.decode(role);
        state.userId = Base64.decode(userId);
        state.tradeConvertData.userId = Base64.decode(userId);
      }
      request.getAllActivity();
      request.getTrade(null);
    });
    // 请求
    const request = {
      insertAttendance() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
            dayTime: moment(new Date()).format("YYYY-MM-DD"),
          },
        };
        // post请求
        post("/lottery/v1/attendance/insertAttendance", data).then(
          (res: any) => {
            let { code, message } = res;
            if (code === 200) {
              ElMessage.success(message);
              request.getUserAttendance();
              request.getUserDay();
              request.getUserPointTotal();
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      getUserAttendance() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
          },
        };
        // post请求
        post("/lottery/v1/attendance/getUserAttendance", data).then(
          (res: any) => {
            // console.log(res);
            let { code, message, customData } = res;
            if (code === 200) {
              state.dateList = customData;
              request.getUserDay();
            } else if (code === 4006) {
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.error(message);
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      getUserDay() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
            dayTime: moment(new Date()).format("YYYY-MM-DD"),
          },
        };
        // post请求
        post("/lottery/v1/attendance/getUserDay", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            if (customData !== null && customData !== "") {
              state.signNum = 1;
            }
            state.table1 = true;
          } else {
            ElMessage.error(message);
          }
        });
      },
      getUserPointTotal() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
          },
        };
        // post请求
        post("/lottery/v1/userPoints/getUserPiont", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.userPointTotal = customData.point;
          } else {
            ElMessage.error(message);
          }
        });
      },
      go() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
            activityNum: state.activityData[state.index].id,
            point: state.activityData[state.index].partPoint,
          },
        };
        // post请求
        post("/lottery/v1/lottery/insertLottery", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getAllActivity();
          } else {
            ElMessage.error(message);
          }
        });
      },
      getAllActivity() {
        // 请求体数据
        const data = {
          customData: {
            joinUserId: state.userId,
          },
        };
        // post请求
        post("/lottery/v1/activity/getActivity", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.activityData = customData;
          }
        });
      },
      openWinner() {
        // 请求体数据
        const data = {
          customData: {
            activityNum: state.activityData[state.index].id,
          },
        };
        // post请求
        post("/lottery/v1/lottery/getWinner", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success("恭喜用户【" + customData.userName + "】中奖！");
            request.getAllActivity();
          }
        });
      },
      // 商品信息
      getTrade(typeId) {
        // 请求体数据
        const data = {
          customData: {
            typeId,
            page: state.page,
          },
        };
        // post请求
        post("/lottery/v1/mall/getMallTrade", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            state.fitData = customData.resultList;
            state.page.totalCount = customData.totalCount;
          }
        });
      },
      tradeConvert() {
        // 请求体数据
        const data = {
          customData: state.tradeConvertData,
        };
        // post请求
        post("/lottery/v1/mall/tradeConvert", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            if (state.typeId === "0") {
              request.getTrade(null);
            } else {
              request.getTrade(parseInt(state.typeId));
            }
          } else if (message === "商品已售罄") {
            ElMessage.warning(message + "，正在查询更多同类商品");
            if (state.typeId === "0") {
              request.getTrade(null);
            } else {
              request.getTrade(parseInt(state.typeId));
            }
          } else {
            ElMessage.error(message);
          }
        });
      },
      getRecordList(userId, tradeUserId, num) {
        // 请求体数据
        const data = {
          customData: {
            userId: userId,
            tradeUserId: tradeUserId,
          },
        };
        // post请求
        post("/lottery/v1/forRecord/getForRecordList", data).then(
          (res: any) => {
            // console.log(res);
            let { code, message, customData } = res;
            if (code === 200) {
              state.recordData = customData;
              if (num === 2) {
                state.table2 = true;
              } else if (num === 3) {
                state.table3 = true;
              } else if (num === 4) {
                state.table4 = true;
              }
            } else if (code === 4006) {
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.error(message);
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      // 上传预览图
      uploadImg(formData) {
        // post请求
        post("/shuaigang/v1/upload/uploadImg", formData).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            // console.log(res);
            state.inputData.tradeImg = customData.imgPath;
          } else {
            ElMessage.error("上传失败");
          }
        });
      },
      // 上传预览图
      uploadImg2(formData) {
        // post请求
        post("/shuaigang/v1/upload/uploadImg", formData).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            // console.log(res);
            state.inputData01.prizeImg = customData.imgPath;
          } else {
            ElMessage.error("上传失败");
          }
        });
      },
      // 取消时删除上传的图片
      deleteImg(img) {
        // 请求体数据
        const data = {
          customData: {
            filePath: img,
          },
        };
        // post请求
        post("/shuaigang/v1/upload/deleteFile", data).then((res: any) => {
          let { code, message, customData } = res;
          // console.log(res);
        });
      },
      insertTrade() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
            tradeName: state.inputData.tradeName,
            tradeNum: state.inputData.tradeNum,
            pointNum: state.inputData.pointNum,
            typeId: state.inputData.typeId,
            tradeImg: state.inputData.tradeImg,
          },
        };
        // post请求
        post("/lottery/v1/mall/insertMallTrade", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            state.table5 = false;
            if (state.typeId === "0") {
              request.getTrade(null);
            } else {
              request.getTrade(parseInt(state.typeId));
            }
          } else {
            ElMessage.error(message);
          }
        });
      },
      // 发起抽奖活动
      insertActivity() {
        // 请求体数据
        const data = {
          customData: {
            userId: state.userId,
            activityName: state.inputData01.activityName,
            prizeName: state.inputData01.prizeName,
            prizeImg: state.inputData01.prizeImg,
            partPoint: state.inputData01.partPoint,
            gmtTime: state.inputData01.gmtTime,
          },
        };
        // post请求
        post("/lottery/v1/activity/insertActivity", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success("活动发起成功!");
            state.table01 = false;
            request.getAllActivity();
          } else {
            ElMessage.error(message);
          }
        });
      },
      getActivityList(isEnabled, userId, prizeUserId, num) {
        // 请求体数据
        const data = {
          customData: {
            isEnabled,
            userId,
            prizeUserId,
          },
        };
        // post请求
        post("/lottery/v1/activity/getActivityByCondition", data).then(
          (res: any) => {
            // console.log(res);
            let { code, message, customData } = res;
            if (code === 200) {
              state.activityDataList = customData;
              if (num === 2) {
                state.table02 = true;
              } else if (num === 3) {
                state.table03 = true;
              } else if (num === 4) {
                state.table04 = true;
              }
            } else if (code === 4006) {
              localStorage.setItem("token", "");
              localStorage.setItem("shuaigangOVO", "");
              localStorage.setItem("shuaigangQWQ", "");
              window.location.reload();
              ElMessage.error(message);
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
      // 处理订单
      updateRecordStatus(id, convertStatus, userId, tradeId, subNum, people) {
        // 请求体数据
        const data = {
          customData: {
            id,
            userId,
            tradeId,
            subNum,
            convertStatus,
          },
        };
        // post请求
        post("/lottery/v1/forRecord/updateRecordStatus", data).then(
          (res: any) => {
            let { code, message, customData } = res;
            if (code === 200) {
              ElMessage.success(message);
              if (people === "商家") {
                request.getRecordList("", state.userId, 3);
              } else {
                request.getRecordList("", state.userId, 4);
              }
              if (convertStatus !== 1) {
                if (state.typeId === "0") {
                  request.getTrade(null);
                } else {
                  request.getTrade(parseInt(state.typeId));
                }
              }
            } else {
              ElMessage.error(message);
            }
          }
        );
      },
    };
    return { ...methods, ...toRefs(state), formData, formData01 };
  },
});
</script>

<style scoped>
.el-calendar {
  --el-calendar-cell-width: 60px;
}
.mall {
  margin: 90px 4% 180px 4%;
}
.demo-image .block {
  padding: 5px 0;
  text-align: center;
  display: inline-block;
  width: 180px;
  margin-left: 10px;
}
.demonstration1 {
  display: block;
  font-size: 15px;
  margin-top: 10px;
}

.demonstration2 {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-top: 3px;
}

.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
.avatar-uploader-icon2 {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.avatar-uploader {
  width: 120px !important;
  height: 120px !important;
  border-radius: 0 !important;
}
.avatar-uploader2 {
  width: 200px !important;
  height: 120px !important;
  border-radius: 0 !important;
}
:deep(.el-image__error) {
  height: 230px !important;
}
.el-menu-item:hover {
  background-color: rgb(0, 0, 0, 0) !important;
}
</style>
