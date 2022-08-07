<template>
  <div id="userManagement" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入用户名进行查询"
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
          <el-button style="background-color: #e1f3d8" @click="insertEvent()"
            >新增用户</el-button
          >
        </el-col>
      </el-row>

      <el-dialog
        v-model="dialogVisible2"
        title="新增用户"
        width="30%"
        :before-close="handleClose2"
      >
        <el-form
          ref="formData"
          :model="userData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名：" prop="userName">
            <el-input v-model="userData.userName" />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="userData.password" show-password />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="userData.birthday"
              type="date"
              placeholder="请选择生日"
              style="width: 100%"
              :disabled-date="disabledDate"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model="userData.phone" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="userData.email" />
          </el-form-item>
          <!-- <el-form-item label="角色：" prop="role">
            <el-input v-model="userData.role" />
          </el-form-item> -->
          <el-form-item label="地址：" prop="address">
            <el-input v-model="userData.address" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="userData.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
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

      <el-table-column label="用户名" prop="userName" />
      <el-table-column label="生日" prop="birthday" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="性别" prop="sex" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="角色" prop="role" />
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
              ref="editFormData"
              :model="editForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名：" prop="userName">
                <el-input v-model="editForm.userName" />
              </el-form-item>
              <el-form-item label="生日：" required prop="birthday">
                <el-date-picker
                  v-model="editForm.birthday"
                  type="date"
                  placeholder="请选择生日"
                  style="width: 100%"
                  :disabled-date="disabledDate"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="电话：" prop="phone">
                <el-input v-model="editForm.phone" />
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="editForm.email" />
              </el-form-item>
              <el-form-item label="角色：" prop="role">
                <el-input v-model="editForm.role" />
              </el-form-item>
              <el-form-item label="地址：" prop="address">
                <el-input v-model="editForm.address" />
              </el-form-item>
              <el-form-item label="性别：" prop="sex">
                <el-radio-group v-model="editForm.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate">取消</el-button>
                  <el-button type="primary" @click="updateUserNow"
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

    <div class="block" align="center" style="margin-top: 20px">
      <el-pagination
        :currentPage="page.index"
        :page-size="page.size"
        :total="page.totalCount"
        layout="prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import post from "../.././http/axios/index";
import { defineComponent, reactive, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    const formData = ref();
    const editFormData = ref();
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      tableData: [],
      page: {
        index: 1,
        size: 8,
        totalCount: 0,
      },
      editForm: {
        id: "",
        password: "",
        userName: "",
        birthday: "",
        address: "",
        phone: "",
        sex: "",
        email: "",
        role: "",
      },
      userData: {
        password: "",
        userName: "",
        birthday: "",
        address: "",
        phone: "",
        sex: "",
        email: "",
        role: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "长度在二到八位之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "示例：Aa123456",
            trigger: "blur",
            transform(value) {
              let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
          {
            min: 8,
            max: 16,
            message: "长度在8到16位之间",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号格式错误",
            trigger: "blur",
            type: "number",
            transform(value) {
              let regex = /^1[3|4|5|7|8]\d{9}$/;
              if (regex.test(value)) {
                return Number(value);
              }
            },
          },
        ],
        email: [
          {
            required: true,
            message: "示例：1491900793@qq.com",
            trigger: "blur",
            transform(value) {
              let regex =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              if (regex.test(value)) {
                return value;
              }
            },
          },
        ],
        role: [],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请输入生日",
            trigger: "change",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
      },
    });

    const methods = {
      // 模糊查询
      fuzzySearch() {
        request.getList();
      },
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      //分页
      handleSizeChange(size) {
        state.page.size = size;
        request.getList();
        // console.log(`每页 ${size} 条`);
      },
      handleCurrentChange(index) {
        state.page.index = index;
        request.getList();
        // console.log(`当前页: ${index}`);
      },
      //新增用户
      insertEvent() {
        state.dialogVisible2 = true;
      },
      handleClose2() {
        state.dialogVisible2 = false;
      },
      resetForm() {
        const form = formData.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineInsert() {
        const form = formData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            (state.userData.birthday = moment(state.userData.birthday).format(
              "YYYY-MM-DD"
            )),
              request.insertUser();
          }
        });
        request.getList();
      },

      //编辑用户
      handleEdit(row) {
        // console.log(row);
        state.editForm.id = row.id;
        state.editForm.userName = row.userName;
        state.editForm.birthday = row.birthday;
        state.editForm.address = row.address;
        state.editForm.phone = row.phone;
        state.editForm.sex = row.sex;
        state.editForm.email = row.email;
        state.dialogVisible = true;
      },
      handleClose() {
        state.dialogVisible = false;
      },
      cancelUpdate() {
        const form = editFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateUserNow() {
        const form = editFormData.value;
        if (!form) return;
        form.validate((valid: Boolean) => {
          if (valid) {
            (state.editForm.birthday = moment(state.editForm.birthday).format(
              "YYYY-MM-DD"
            )),
              request.updateUser();
            state.dialogVisible = false;
          }
        });
      },

      //删除用户
      handleDelete(id) {
        // console.log(id);
        const data = {
          customData: {
            ids: [id],
          },
        };
        post("/shuaigang/v1/user/deleteUser", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          if (message === "OK" && code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      cancelEvent() {
        ElMessage.success("取消成功！");
      },
    };

    onMounted(() => {
      request.getList();
    });

    const request = {
      getList() {
        const data = {
          customData: {
            fuzzySearch: state.fuzzySearchData,
            page: state.page,
          },
        };
        // console.log(data);

        post("/shuaigang/v1/user/getAllUser", data).then((res: any) => {
          // console.log(res);
          let { code, message, customData } = res;
          state.tableData = customData.resultList;
          state.page.totalCount = customData.totalCount;
        });
      },
      updateUser() {
        const data = {
          customData: state.editForm,
        };
        post("/shuaigang/v1/user/updateUser", data).then((res: any) => {
          // console.log(res);
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      insertUser() {
        const data = {
          customData: state.userData,
        };
        // console.log(data);
        post("/shuaigang/v1/user/insertUser", data).then((res: any) => {
          // console.log(res);
          let { code, message } = res;
          if (code === 200) {
            state.dialogVisible2 = false;
            ElMessage.success("新增成功");
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
    };

    return { ...methods, ...toRefs(state), formData, editFormData };
  },
});
</script>

<style>
.common {
  text-align: right;
  margin-top: 8px;
  font-weight: bolder;
}
.public {
  height: 18px;
  width: 80%;
  border-radius: 4px;
}
</style>
