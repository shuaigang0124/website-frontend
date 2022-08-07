<template>
  <div id="yearPlan" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>计划管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入相关数据进行查询"
            v-model="fuzzySearchData"
            class="input-with-select"
            style="width: 40%"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="fuzzySearch" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button style="background-color: #e1f3d8" @click="addEvent"
            >新增计划</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible2"
        title="新增计划"
        width="30%"
        :before-close="handleClose2"
      >
        <el-form
          ref="addData"
          :model="addDiaryForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="年份id：" prop="yearId">
            <el-select
              v-model="addDiaryForm.yearId"
              placeholder="请选择所属年份"
            >
              <el-option
                v-for="year in year"
                :key="year.id"
                :label="year.id"
                :value="year.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划：" prop="plan">
            <el-input v-model="addDiaryForm.plan" />
          </el-form-item>
          <el-form-item align="center">
            <span class="dialog-footer">
              <el-button @click="cancelAdd">取消</el-button>
              <el-button type="primary" @click="determineAdd">确定</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <el-table :data="diaryData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="年份" prop="yearId" />
      <el-table-column label="计划" prop="plan" />
      <el-table-column
        label="状态(0-完成,1-延期,2-未完成,3-未开始)"
        prop="isEnabled"
      />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="updateEvent(scope.row)"
            >编辑</el-button
          >
          <el-dialog
            v-model="dialogVisible"
            title="编辑"
            width="40%"
            :before-close="updateClose"
          >
            <el-form
              ref="updateFormData"
              :model="diaryForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="年份id：" prop="yearId">
                <el-select
                  v-model="diaryForm.yearId"
                  placeholder="请选择所属年份"
                >
                  <el-option
                    v-for="year in year"
                    :key="year.id"
                    :label="year.id"
                    :value="year.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计划：" prop="plan">
                <el-input v-model="diaryForm.plan" />
              </el-form-item>
              <el-form-item label="状态：" prop="isEnabled">
                <el-radio-group v-model="diaryForm.isEnabled">
                  <el-radio :label="0">已完成</el-radio>
                  <el-radio :label="1">延期完成</el-radio>
                  <el-radio :label="2">未完成</el-radio>
                  <el-radio :label="3">未开始</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate">取消</el-button>
                  <el-button type="primary" @click="updateDiary"
                    >确定</el-button
                  >
                </span>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-popconfirm
            title="你确定删除吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="deleteDiary(scope.row.id)"
            @cancel="cancelDelete()"
          >
            <template #reference>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import post from "../../http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const addData = ref();
    const updateFormData = ref();
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      inputDiary: "",
      diaryData: [],
      diaryForm: {
        id: "",
        yearId: "",
        plan: "",
        isEnabled: "",
      },
      addDiaryForm: {
        yearId: "",
        plan: "",
        isEnabled: "",
      },
      year: [],
      rules: {
        yearId: [
          {
            required: true,
            message: "请输入年份id",
            trigger: "blur",
          },
        ],
        plan: [
          {
            required: true,
            message: "请输入计划",
            trigger: "blur",
          },
        ],
        isEnabled: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    });
    const methods = {
      // 模糊查询
      fuzzySearch() {
        request.getList();
      },
      //新增
      addEvent() {
        state.dialogVisible2 = true;
      },
      handleClose2() {
        state.dialogVisible2 = false;
      },
      cancelAdd(addDiaryForm) {
        const form = addData.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(addDiaryForm) {
        const form = addData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            state.dialogVisible2 = false;
            request.insert();
          }
        });
        request.getList();
      },

      //修改
      updateEvent(row) {
        state.diaryForm.id = row.id;
        state.diaryForm.yearId = row.yearId;
        state.diaryForm.plan = row.plan;
        state.diaryForm.isEnabled = row.isEnabled;
        state.dialogVisible = true;
        console.log(state.diaryForm.id);
      },
      updateClose() {
        state.dialogVisible = false;
      },
      cancelUpdate() {
        const form = updateFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateDiary() {
        const form = updateFormData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            state.dialogVisible = false;
            request.update();
          }
        });
      },
      //删除
      cancelDelete() {
        state.dialogVisible = false;
      },
      deleteDiary(id) {
        // console.log();
        request.delete(id);
      },
    };
    onMounted(() => {
      request.getList();
    });
    const request = {
      insert() {
        const data = {
          customData: state.addDiaryForm,
        };
        // console.log(data);
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.warning(message);
          }
        });
      },
      getList() {
        const data = {
          customData: {
            fuzzySearch: state.fuzzySearchData,
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, customData, message } = res;
          if (code === 200) {
            state.diaryData = customData;
            request.getYearList();
          } else {
            ElMessage.error(message);
          }
        });
      },
      getYearList() {
        const data = {
          customData: {},
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, customData, message } = res;
          if (code === 200) {
            state.year = customData;
          } else {
            ElMessage.error(message);
          }
        });
      },
      update() {
        const data = {
          customData: state.diaryForm,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      delete(id) {
        const data = {
          customData: {
            ids: [id],
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
    };
    return { ...methods, ...toRefs(state), addData, updateFormData };
  },
});
</script>
<style>
/* .el-overlay {
  background-color: rgba(0, 0, 0, 0.1);
} */
</style>