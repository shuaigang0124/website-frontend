<template>
  <div id="diary" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>日记管理</el-breadcrumb-item>
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
            >新增日记</el-button
          >
        </el-col>
      </el-row>
      <el-drawer
        v-model="dialogVisible2"
        title="新增日记"
        direction="rtl"
        size="40%"
        :z-index="2"
      >
        <el-form
          ref="addData"
          :model="addDiaryForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="天气：" prop="weather">
            <el-input v-model="addDiaryForm.weather" />
          </el-form-item>
          <el-form-item label="心情：" prop="mood">
            <el-input v-model="addDiaryForm.mood" />
          </el-form-item>
          <TEditor ref="editRef" :value="content1" :height="400" />
          <el-form-item align="center" style="margin-top: 10px">
            <span class="dialog-footer">
              <el-button @click="cancelAdd">取消</el-button>
              <el-button type="primary" @click="determineAdd">确定</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>

    <el-table :data="diaryData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="日期" prop="day" />
      <el-table-column label="天气" prop="weather" />
      <el-table-column label="心情" prop="mood" />
      <el-table-column label="内容" prop="content" show-overflow-tooltip />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="updateEvent(scope.row)"
            >编辑</el-button
          >

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
    <el-drawer
      v-model="dialogVisible"
      title="编辑"
      direction="rtl"
      size="40%"
      :z-index="2"
      ><el-form
        ref="updateFormData"
        :model="diaryForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="天气：" prop="weather">
          <el-input v-model="diaryForm.weather" />
        </el-form-item>
        <el-form-item label="心情：" prop="mood">
          <el-input v-model="diaryForm.mood" />
        </el-form-item>
        <TEditor ref="editRef" :value="content2" :height="400" />
        <el-form-item align="center" style="margin-top: 10px">
          <span class="dialog-footer">
            <el-button @click="cancelUpdate">取消</el-button>
            <el-button type="primary" @click="updateDiary">确定</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import post from "../../http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import TEditor from "../../components/txt/TEditor.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    TEditor,
  },
  props: {},
  setup() {
    const editRef = ref();
    const addData = ref();
    const updateFormData = ref();
    const state = reactive({
      content1: "",
      content2: "",
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      inputDiary: "",
      diaryData: [],
      diaryForm: {
        id: "",
        weather: "",
        mood: "",
        content: "",
      },
      addDiaryForm: {
        weather: "",
        mood: "",
        content: "",
      },
      rules: {
        weather: [
          {
            required: true,
            message: "请输入天气",
            trigger: "blur",
          },
        ],
        mood: [
          {
            required: true,
            message: "请输入心情",
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
    const methods = {
      // 模糊查询
      fuzzySearch() {
        request.getList();
      },
      //新增
      addEvent() {
        state.dialogVisible2 = true;
      },
      cancelAdd(addDiaryForm) {
        const form = addData.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(addDiaryForm) {
        const edit = editRef;
        state.addDiaryForm.content = edit.value.contentValue;
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
        state.diaryForm.weather = row.weather;
        state.diaryForm.mood = row.mood;
        state.content2 = row.content;
        state.dialogVisible = true;
      },
      cancelUpdate() {
        const form = updateFormData.value;
        if (form) form.resetFields();
        state.content2 = "";
        state.dialogVisible = false;
      },
      updateDiary() {
        const edit = editRef;
        state.diaryForm.content = edit.value.contentValue;
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
          let { code, customData } = res;
          state.diaryData = customData;
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
            state.content2 = '';
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
    return { ...methods, ...toRefs(state), addData, updateFormData, editRef };
  },
});
</script>
<style>
/* .el-overlay {
  background-color: rgba(0, 0, 0, 0.1);
} */
</style>