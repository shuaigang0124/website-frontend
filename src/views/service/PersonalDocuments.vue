<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人文档</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入文件相关内容进行查询"
            v-model="input"
            class="input-with-select"
            style="width: 30%"
          >
            <template #append>
              <el-button icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button style="background-color: #e1f3d8" @click="insertEvent()">上传文件</el-button>
        </el-col>
      </el-row>

      <el-dialog
        v-model="dialogVisible2"
        title="新增文件"
        width="30%"
        :before-close="handleClose2"
      >
        <el-form
          ref="insertForm"
          :model="insertData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="文件名称：" prop="name">
            <el-input v-model="insertData.name" />
          </el-form-item>
          <el-form-item label="文件备注：" prop="remark">
            <el-input v-model="insertData.remark"/>
          </el-form-item>
          <el-form-item label="文件地址：" prop="address">
            <el-input v-model="insertData.address" />
          </el-form-item>
          <el-form-item label="文件大小：" prop="size">
            <el-input v-model="insertData.size" />
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
      </el-dialog>
    </div>

    <el-table :data="tableData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column label="名字" prop="name" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="大小" prop="size" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-dialog
            v-model="dialogVisible"
            title="编辑"
            width="30%"
            :before-close="handleClose"
          >
            <el-form
              ref="updateForm"
              :model="updateData"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="文件名：" prop="name">
                <el-input v-model="updateData.name" />
              </el-form-item>
              <el-form-item label="文件备注：" prop="remark">
                <el-input v-model="updateData.remark" />
              </el-form-item>
              <el-form-item label="地址：" prop="address">
                <el-input v-model="updateData.address" />
              </el-form-item>
              <el-form-item label="文件大小：" prop="size">
                <el-input v-model="updateData.size" />
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate">取消</el-button>
                  <el-button type="primary" @click="updateNow">确定</el-button>
                </span>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-popconfirm
            title="你确定删除该用户吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)"
            @cancel="cancelEvent"
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
import post from "@/http/axios";
import { ElMessage } from "element-plus";
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const insertForm = ref();
    const updateForm = ref();
    // 页面数据
    const state = reactive({
      dialogVisible: false,
      dialogVisible2: false,
      tableData: [
        {
          name: "",
          remark: "",
          address: "",
          size: "",
        },
      ],
      updateData: {
        id: "",
        name: "",
        remark: "",
        address: "",
        size: "",
      },
      insertData: {
        name: "",
        remark: "",
        address: "",
        size: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        // remark: [
        //   {
        //     required: true,
        //     message: "输入内容不能为空！",
        //     trigger: "blur",
        //   },
        // ],
        address: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        size: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
      },
    });
    // 方法体
    const methods = {
      // 新增
      insertEvent() {
        state.dialogVisible2 = true;
      },
      handleClose2() {
        state.dialogVisible2 = false;
      },
      resetForm() {
        const form = insertForm.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineInsert() {
        const form = insertForm.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            request.insert();
          }
        });
        request.getList();
      },

      // 编辑
      handleEdit(row) {
        state.updateData.id = row.id;
        state.updateData.name = row.name;
        state.updateData.remark = row.remark;
        state.updateData.address = row.address;
        state.updateData.size = row.size;
        state.dialogVisible = true;
      },
      handleClose() {
        state.dialogVisible = false;
      },
      cancelUpdate() {
        const form = updateForm.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateNow() {
        const form = updateForm.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            request.update();
            state.dialogVisible = false;
          }
        });
      },
      // 删除
      handleDelete(id) {
        request.delete(id);
      },
      cancelEvent() {
        ElMessage.success("取消成功！");
      },
    };
    // 页面默认请求
    onMounted(() => {
      request.getList();
    });
    // 请求
    const request = {
      getList() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("/shuaigang/v1/myFile/getMyFile", data).then((res: any) => {
          let { code, customData } = res;
          if (code === 200) {
            state.tableData = customData;
          }
        });
      },
      insert() {
        const data = {
          customData: state.insertData,
        };
        post("/shuaigang/v1/myFile/insertMyFile", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            state.dialogVisible2 = false;
            request.getList();
          } else {
            ElMessage.warning(message);
          }
        });
      },
      update() {
        // 请求体数据
        const data = {
          customData: state.updateData,
        };
        // post请求
        post("/shuaigang/v1/myFile/updateMyFile", data).then((res: any) => {
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
        post("/shuaigang/v1/myFile/deleteMyFile", data).then((res: any) => {
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
    return { ...methods, ...toRefs(state), insertForm, updateForm };
  },
});
</script>

<style>
</style>
