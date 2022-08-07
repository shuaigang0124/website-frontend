<template>
  <div id="updateLog" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>更新日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <!-- <el-input
            placeholder="请输入日志相关内容进行查询"
            v-model="input"
            class="input-with-select"
            style="width: 40%"
          >
            <template #append>
              <el-button icon="el-icon-search" />
            </template>
          </el-input> -->
        </el-col>
        <el-col :span="3">
          <el-button style="background-color: #e1f3d8" @click="addEvent()"
            >新增日志</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible"
        title="新增日志"
        width="30%"
        :before-close="handleClose"
      >
        <el-form
          ref="logFormData"
          :model="logForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="创建者：" prop="author">
            <el-input v-model="logForm.author" />
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <el-input v-model="logForm.content" />
          </el-form-item>
          <el-form-item align="center">
            <span class="dialog-footer">
              <el-button @click="cancelAdd('state.logForm')">取消</el-button>
              <el-button type="primary" @click="determineAdd('state.logForm')"
                >确定</el-button
              >
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <el-table :data="tableData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="作者" prop="author" />
      <el-table-column label="文本" prop="content" width="800" />
      <el-table-column label="时间" prop="gmtCreate" />
    </el-table>

    <div class="block" align="center" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="page.index"
        :page-size="page.size"
        layout="prev, pager, next, jumper"
        :total="page.totalCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import post from "../.././http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const logFormData = ref();
    // 页面数据
    const state = reactive({
      inputLog: "",
      dialogVisible: false,
      tableData: [],
      page: {
        index: 1,
        size: 8,
        totalCount: 0,
      },
      logForm: {
        author: "",
        content: "",
      },
      rules: {
        author: [
          {
            required: true,
            message: "请输入创建者",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    });
    // 方法体
    const methods = {
      // 分页
      handleSizeChange(size) {
        state.page.size = size;
        request.getList();
      },
      handleCurrentChange(index) {
        state.page.index = index;
        request.getList();
      },
      //新增
      addEvent() {
        state.dialogVisible = true;
      },
      handleClose() {
        state.dialogVisible = false;
      },
      cancelAdd(logForm) {
        const form = logFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      determineAdd() {
        const form = logFormData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            request.insert();
          }
        });
        request.getList();
      },
    };
    // 页面默认请求
    onMounted(() => {
      request.getList();
    });
    // 请求
    const request = {
      insert() {
        // 请求体数据
        const data = {
          customData: state.logForm,
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message } = res;
          if (code === 200) {
            state.dialogVisible = false;
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      getList() {
        // 请求体数据
        const data = {
          customData: {
            page: state.page,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          state.tableData = customData.resultList;
          state.page.totalCount = customData.totalCount;
        });
      },
    };
    return { ...methods, ...toRefs(state), logFormData };
  },
});
</script>

<style>
</style>
