<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>愿望清单</el-breadcrumb-item>
      </el-breadcrumb>

      <div
        style="height: 1px; margin: 10px 0; background-color: burlywood"
      ></div>

      <div style="margin-top: 15px">
        <el-row>
          <el-col :span="21">
            <el-input
              placeholder="请输入相关愿望标题进行查询"
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
            <el-button style="background-color: #e1f3d8" @click="addEvent()"
              >新增愿望</el-button
            >
          </el-col>
        </el-row>
        <el-dialog
          v-model="dialogVisible2"
          title="新增愿望"
          width="30%"
          :before-close="handleClose2"
        >
          <el-form
            ref="addLogFormData"
            :model="addWishForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="标题：" prop="title">
              <el-input v-model="addWishForm.title" />
            </el-form-item>
            <el-form-item label="内容：" prop="content">
              <el-input v-model="addWishForm.content" />
            </el-form-item>
            <el-form-item label="完成率：" prop="completion">
              <el-input v-model="addWishForm.completion" />
            </el-form-item>
            <el-form-item align="center">
              <span class="dialog-footer">
                <el-button @click="cancelAdd('state.addWishForm')"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="determineAdd('state.addWishForm')"
                  >确定</el-button
                >
              </span>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <el-table
        :data="wishListData"
        border
        style="width: 100%; margin-top: 15px"
      >
        <el-table-column type="index" label="序号" width="50" />

        <el-table-column
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column label="内容" prop="content" show-overflow-tooltip />
        <el-table-column label="完成率" prop="completion" width="80" />
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
                ref="updateLogFormData"
                :model="wishListForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="标题：" prop="title">
                  <el-input v-model="wishListForm.title" />
                </el-form-item>
                <el-form-item label="内容：" prop="content">
                  <el-input v-model="wishListForm.content" />
                </el-form-item>
                <el-form-item label="完成率：" prop="completion">
                  <el-input v-model="wishListForm.completion" />
                </el-form-item>
                <el-form-item align="center">
                  <span class="dialog-footer">
                    <el-button @click="cancelUpdate('state.wishListForm')"
                      >取消</el-button
                    >
                    <el-button
                      type="primary"
                      @click="updateWishList('state.wishListForm')"
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
              @confirm="deleteWishList(scope.row.id)"
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
    const addLogFormData = ref();
    const updateLogFormData = ref();
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dialogVisible2: false,
      inputWishlist: "",
      wishListData: [],
      wishListForm: {
        id: "",
        title: "",
        content: "",
        completion: "",
      },
      addWishForm: {
        title: "",
        content: "",
        completion: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
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
        completion: [
          {
            required: true,
            message: "请输入完成率(只能为数字)",
            trigger: "blur",
            type: "number",
            transform(value) {
              if (value) {
                return Number(value);
              }
            },
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
      cancelAdd(addWishForm) {
        const form = addLogFormData.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(addWishForm) {
        const form = addLogFormData.value;
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
        state.wishListForm.id = row.id;
        state.wishListForm.title = row.title;
        state.wishListForm.content = row.content;
        state.wishListForm.completion = row.completion;
        state.dialogVisible = true;
      },
      updateClose() {
        state.dialogVisible = false;
      },
      cancelUpdate() {
        const form = updateLogFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateWishList() {
        const form = updateLogFormData.value;
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
      deleteWishList(id) {
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
          customData: state.addWishForm,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message, customData } = res;
          if (code === 200) {
            ElMessage.success(message);
            request.getList();
          } else {
            ElMessage.info(message);
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
          let { customData } = res;
          state.wishListData = customData;
        });
      },
      update() {
        const data = {
          customData: state.wishListForm,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
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
      delete(id) {
        const data = {
          customData: {
            ids: [id],
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
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
    };
    return { ...methods, ...toRefs(state), addLogFormData, updateLogFormData };
  },
});
</script>

<style>
</style>