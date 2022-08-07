<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>日常分享</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <div style="margin-top: 15px">
      <el-row>
        <el-col :span="21">
          <el-input
            placeholder="请输入用户相关内容进行查询"
            v-model="fuzzySearchData"
            class="input-with-select"
            style="width: 30%"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="fuzzySearch" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <!-- <el-button style="background-color: #e1f3d8">新增日常分享</el-button> -->
        </el-col>
      </el-row>
    </div>

    <el-table :data="dailySharing" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" label="序号" width="50"></el-table-column>

      <el-table-column label="标题" prop="title" />
      <el-table-column
        label="描述"
        prop="titleDescribe"
        show-overflow-tooltip
      />
      <el-table-column label="内容" prop="content" show-overflow-tooltip />
      <el-table-column label="图片" prop="img" show-overflow-tooltip />
      <el-table-column label="修改时间" prop="gmtModified" />

      <el-table-column label="操作">
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
              <el-form-item label="标题：" prop="title">
                <el-input v-model="updateData.title" />
              </el-form-item>
              <el-form-item label="标题描述：" prop="titleDescribe">
                <el-input v-model="updateData.titleDescribe" />
              </el-form-item>
              <el-form-item label="内容：" prop="content">
                <el-input v-model="updateData.content" />
              </el-form-item>
              <el-form-item label="图片：" prop="img">
                <el-input v-model="updateData.img" />
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

    <div class="block" align="center" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :currentPage="page.index"
        :page-size="page.size"
        :total="page.totalCount"
        layout="prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
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
    const updateForm = ref();
    // 页面数据
    const state = reactive({
      fuzzySearchData: "",
      dialogVisible: false,
      dailySharing: [
        {
          title: "",
          img: "",
          titleDescribe: "",
          content: "",
          gmtModified: "",
        },
      ],
      page: {
        index: 1,
        size: 8,
        totalCount: 0,
      },
      updateData: {
        id: "",
        title: "",
        img: "",
        titleDescribe: "",
        content: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        titleDescribe: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        img: [
          {
            required: true,
            message: "输入内容不能为空！",
            trigger: "blur",
          },
        ],
        gmtModified: [
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
      // 模糊查询
      fuzzySearch() {
        request.getList();
      },
      //分页
      handleSizeChange(size) {
        state.page.size = size;
        request.getList();
      },
      handleCurrentChange(index) {
        state.page.index = index;
        request.getList();
      },
      //编辑
      handleEdit(row) {
        state.updateData.id = row.id;
        state.updateData.title = row.title;
        state.updateData.titleDescribe = row.titleDescribe;
        state.updateData.content = row.content;
        state.updateData.img = row.img;
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
      //删除
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
          customData: {
            page: state.page,
            fuzzySearch: state.fuzzySearchData,
          },
        };
        // post请求
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            // console.log(res);
            let { code, message, customData } = res;
            state.dailySharing = customData.resultList;
            state.page.totalCount = customData.totalCount;
          }
        );
      },
      update() {
        const data = {
          customData: {
            sharingId: state.updateData.id,
            title: state.updateData.title,
            img: state.updateData.img,
            titleDescribe: state.updateData.titleDescribe,
            content: state.updateData.content,
          },
        };
        // console.log(state.updateData);
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message } = res;
            if (code === 200) {
              ElMessage.success(message);
              request.getList();
            } else {
              ElMessage.info(message);
            }
          }
        );
      },
      delete(id) {
        const data = {
          customData: {
            sharingId: id,
            deleted: 1,
          },
        };
        post("xx/xx/xx/xx", data).then(
          (res: any) => {
            let { code, message } = res;
            if (code === 200) {
              ElMessage.success(message);
              request.getList();
            } else {
              ElMessage.info(message);
            }
          }
        );
      },
    };
    return { ...methods, ...toRefs(state), updateForm };
  },
});
</script>
<style>
</style>
