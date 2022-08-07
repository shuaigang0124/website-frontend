<template>
  <div id="tag" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>标签管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入相关标签进行查询"
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
            >新增标签</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible2"
        title="新增标签"
        width="30%"
        :show-close="false"
      >
        <el-form
          ref="addForm"
          :model="addTagData"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="标签名称：" prop="name">
            <el-input v-model="addTagData.name" />
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

    <el-table :data="tagData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="标签名称" prop="name" />
      <el-table-column label="删除标识（0:未删除1:已删除）" prop="deleted" />
      <el-table-column label="创建时间" prop="gmtCreate" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="mini" @click="updateEvent(scope.row)"
            >编辑</el-button
          >
          <el-dialog
            v-model="dialogVisible"
            :modal="false"
            :show-close="false"
            title="编辑"
            width="30%"
          >
            <el-form
              ref="updateFormData"
              :model="tagForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="标签名称：" prop="name">
                <el-input v-model="tagForm.name" />
              </el-form-item>
              <el-form-item label="是否删除：" prop="deleted">
                <el-radio-group v-model="tagForm.deleted">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item align="center">
                <span class="dialog-footer">
                  <el-button @click="cancelUpdate">取消</el-button>
                  <el-button type="primary" @click="updateTag">确定</el-button>
                </span>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-popconfirm
            title="你确定删除吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="deleteTag(scope.row.id)"
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
      tagData: [],
      tagForm: {
        id: "",
        name: "",
        deleted: 0,
      },
      addTagData: {
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入标签名称",
            trigger: "blur",
          },
        ],
        deleted: [
          {
            required: true,
            message: "必选任意一项",
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
      cancelAdd(addTagData) {
        const form = addForm.value;
        if (form) form.resetFields();
        state.dialogVisible2 = false;
      },
      determineAdd(addTagData) {
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
        state.tagForm.id = row.id;
        state.tagForm.name = row.name;
        state.tagForm.deleted = row.deleted;
        state.dialogVisible = true;
      },
      cancelUpdate() {
        const form = updateFormData.value;
        if (form) form.resetFields();
        state.dialogVisible = false;
      },
      updateTag() {
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
      deleteTag(id) {
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
          customData: state.addTagData,
        };
        // console.log(data);
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
        const data = {
          customData: {
            fuzzySearch: state.fuzzySearchData,
          },
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.tagData = customData;
          }
        });
      },
      update() {
        const data = {
          customData: state.tagForm,
        };
        post("xx/xx/xx/xx", data).then((res: any) => {
          let { code, message } = res;
          if (code === 200) {
            ElMessage.success("修改成功！");
            request.getList();
          } else {
            ElMessage.info(message);
          }
        });
      },
      delete(id) {
        const data = {
          customData: {
            id,
            deleted: 1,
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
    return { ...methods, ...toRefs(state), addForm, updateFormData };
  },
});
</script>

<style scoped>
</style>