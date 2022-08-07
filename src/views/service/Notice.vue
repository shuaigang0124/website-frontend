<template>
  <div id="notice" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入相关公告进行查询"
            v-model="fuzzySearchData"
            class="input-with-select"
            style="width: 40%"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="fuzzySearch()" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button style="background-color: #e1f3d8" @click="addEvent"
            >新增公告</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible2"
        title="新增公告"
        width="30%"
        :show-close="false"
      >
        <el-form
          ref="addForm"
          :model="addNoticeData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="公告排序：" prop="sort">
            <el-input v-model="addNoticeData.sort" />
          </el-form-item>
          <el-form-item label="公告内容：" prop="content">
            <el-input v-model="addNoticeData.content" />
          </el-form-item>
          <el-form-item label="背景颜色：" prop="colorId">
            <el-input v-model="addNoticeData.colorId" />
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

    <el-table :data="noticeData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="公告内容" prop="content" show-overflow-tooltip />
      <el-table-column label="公告顺序" prop="sort" width="100" />
      <el-table-column
        label="背景颜色（1:绿2:蓝3:黄4:红~其它:无色）"
        prop="colorId"
      />
      <el-table-column
        label="是否启用(1:是0:否)"
        prop="isEnabled"
        width="150"
      />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="updateEvent(scope.row)"
            >编辑</el-button
          >
          <el-dialog
            v-model="dialogVisible"
            :show-close="false"
            title="编辑"
            width="30%"
          >
            <el-form
              ref="updateFormData"
              :model="noticeFrom"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="公告顺序：" prop="sort">
                <el-input v-model="noticeFrom.sort" />
              </el-form-item>
              <el-form-item label="公告内容：" prop="content">
                <el-input v-model="noticeFrom.content" />
              </el-form-item>
              <el-form-item label="背景颜色：" prop="colorId">
                <el-input v-model="noticeFrom.colorId" />
              </el-form-item>
              <el-form-item label="是否启用：" prop="isEnabled">
                <el-radio-group v-model="noticeFrom.isEnabled">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate">取消</el-button>
                  <el-button type="primary" @click="updateNotice"
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
            @confirm="deleteNotice(scope.row.id)"
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
import post from "../.././http/axios/index";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const addForm = ref();
    const updateFormData = ref();
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      noticeData: [],
      noticeFrom: {
        id: "",
        sort: 1,
        content: "",
        colorId: 0,
        isEnabled: 0,
      },
      addNoticeData: {
        sort: null,
        content: "",
        colorId: 0,
      },
      rules: {
        sort: [
          {
            required: true,
            message: "排序只能为数字",
            trigger: "blur",
            type: "number",
            transform(value) {
              if (value) {
                return Number(value);
              }
            },
          },
        ],
        colorId: [
          {
            required: true,
            message: "1:绿2:蓝3:黄4:红其它为无色",
            trigger: "blur",
            type: "number",
            transform(value) {
              if (value) {
                return Number(value);
              }
            },
          },
        ],
        content: [
          {
            required: true,
            message: "公告内容不能为空",
            trigger: "blur",
          },
        ],
        isEnabled: [
          {
            required: true,
            message: "必选项",
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
      cancelAdd(addNoticeData) {
        const form = addForm.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(addNoticeData) {
        const form = addForm.value;
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
        state.noticeFrom.id = row.id;
        state.noticeFrom.sort = row.sort;
        state.noticeFrom.content = row.content;
        state.noticeFrom.colorId = row.colorId;
        state.noticeFrom.isEnabled = row.isEnabled;
        state.dialogVisible = true;
      },
      cancelUpdate() {
        const form = updateFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateNotice() {
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
      deleteNotice(id) {
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
          customData: state.addNoticeData,
        };
        // console.log(data);
        post("/shuaigang/v1/notice/insertNotice", data).then((res: any) => {
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
        post("/shuaigang/v1/notice/getBackendNotice", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.noticeData = customData;
          }
        });
      },
      update() {
        const data = {
          customData: state.noticeFrom,
        };
        post("/shuaigang/v1/notice/updateNotice", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.warning(message);
          }
        });
      },
      delete(id) {
        const data = {
          customData: {
            ids: [id],
          },
        };
        post("/shuaigang/v1/notice/deleteNotice", data).then((res: any) => {
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
    return { ...methods, ...toRefs(state), addForm, updateFormData };
  },
});
</script>

<style scoped>
</style>