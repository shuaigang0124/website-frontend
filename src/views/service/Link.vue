<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>友情链接</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入链接名字进行查询"
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
            >新增链接</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible2"
        title="新增链接"
        width="30%"
        :before-close="handleClose2"
      >
        <el-form
          ref="addRef"
          :model="linkData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称：" prop="name">
            <el-input v-model="linkData.name" />
          </el-form-item>
          <el-form-item label="链接地址：" prop="url">
            <el-input v-model="linkData.url" />
          </el-form-item>
          <el-form-item label="链接类型：" prop="type">
            <el-input v-model="linkData.type" />
          </el-form-item>
          <el-form-item align="center">
            <span class="dialog-footer">
              <el-button @click="cancelAdd('state.linkData')">取消</el-button>
              <el-button type="primary" @click="determineAdd('state.linkData')"
                >确定</el-button
              >
            </span>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <el-table :data="tableData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="链接名称" prop="name" />
      <el-table-column label="链接地址" prop="url" show-overflow-tooltip />
      <el-table-column label="链接类型" prop="type" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="updateEvent(scope.row)"
            >编辑</el-button
          >
          <el-dialog
            v-model="dialogVisible"
            title="编辑"
            width="30%"
            :before-close="updateClose"
          >
            <el-form
              ref="linkFormData"
              :model="linkForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="链接名称：" prop="name">
                <el-input v-model="linkForm.name" />
              </el-form-item>
              <el-form-item label="链接地址：" prop="url">
                <el-input v-model="linkForm.url" />
              </el-form-item>
              <el-form-item label="链接类型：" prop="type">
                <el-input v-model="linkForm.type" />
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate('state.linkForm')"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="determineUpdate('state.linkForm')"
                    >确定</el-button
                  >
                </span>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-popconfirm
            title="你确定删除该用户吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="determineDelete(scope.row.id)"
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
  name: "",
  components: {},
  props: {},
  setup() {
    const addRef = ref();
    const linkFormData = ref();
    // 页面数据
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      tableData: [],
      linkForm: {
        id: "",
        name: "",
        url: "",
        type: "",
      },
      linkData: {
        name: "",
        url: "",
        type: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入链接名称",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "请输入链接地址",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请输入链接类型",
            trigger: "blur",
          },
        ],
      },
    });
    // 方法体
    const methods = {
      // 模糊查询
      fuzzySearch() {
        request.getList();
      },
      //新增
      addEvent() {
        const form = addRef.value;
        if (form) form.resetFields();
        state.dialogVisible2 = true;
      },
      handleClose2() {
        state.dialogVisible2 = false;
      },
      cancelAdd(linkData) {
        const form = addRef.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(linkData) {
        const form = addRef.value;
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
        state.linkForm.id = row.id;
        state.linkForm.name = row.name;
        state.linkForm.url = row.url;
        state.linkForm.type = row.type;
        state.dialogVisible = true;
      },
      updateClose() {
        state.dialogVisible = false;
      },
      cancelUpdate() {
        const form = linkFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      determineUpdate() {
        const form = linkFormData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            request.update();
            state.dialogVisible = false;
          } else {
            ElMessage.error("修改失败!");
            return false;
          }
        });
      },

      //删除
      cancelDelete() {
        state.dialogVisible = false;
      },
      determineDelete(id) {
        request.delete(id);
      },
    };
    // 页面默认请求
    onMounted(() => {
      request.getList();
    });
    // 请求
    const request = {
      insert() {
        const data = {
          customData: state.linkData,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            state.dialogVisible2 = false;
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      update() {
        const data = {
          customData: state.linkForm,
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
        // 请求体数据
        const data = {
          customData: {
            ids: [id],
          },
        };
        // post请求
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
      getList() {
        // 请求体数据
        const data = {
          customData: {
            fuzzySearch: state.fuzzySearchData,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, customData } = res;
          state.tableData = customData;
        });
      },
    };
    return { ...methods, ...toRefs(state), addRef, linkFormData };
  },
});
</script>

<style>
</style>
