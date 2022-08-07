<template>
  <div class="tinymce-box">
    <Editor :id="id" v-model="contentValue" :init="init" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
//引入tinymce编辑器

//引入node_modules里的tinymce相关文件文件
import tinymce from "tinymce/tinymce"; //tinymce默认hidden，不引入则不显示编辑器
import Editor from "@tinymce/tinymce-vue";

import "tinymce/skins/ui/oxide/skin.min.css";

import "tinymce/icons/default/icons";
//主题
import "tinymce/themes/silver";
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/paste";
import post from "@/http/axios";

export default defineComponent({
  name: "TEditor",
  // emits: ['sureEdit'],
  components: {
    Editor,
  },
  props: {
    moduleId: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 700,
    },
    editId: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    plugins: {
      type: [String, Array],
      default:
        "powerpaste link lists image paste code table wordcount media preview fullscreen help",
    },
    baseUrl: {
      type: String,
      default: "",
    },
    toolbar: {
      type: [String, Array],
      default:
        "bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | undo redo | lists table image media | removeformat | fullscreen preview paste",
    },
  },

  setup(props) {
    const editId = props.editId;
    const edit = tinymce.editors as any;
    const state = reactive({
      init: {
        selector: "#" + props.editId,
        language_url: `/tinymce/langs/zh_CN.js`,
        language: `zh_CN`,
        skin_url: `/tinymce/skins/ui/oxide`,
        // skin_url: '/tinymce/skins/ui/oxide-dark',//皮肤：暗色
        plugins: props.plugins, //插件配置
        paste_as_text: false,
        toolbar: props.toolbar, //工具栏配置，设为false则隐藏
        content_css: "tinymce/skins/content/default/content.css",
        /** *********************************powerpast开始***********************************/
        powerpaste_word_import: "merge", // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: "merge", // propmt, merge, clear
        // powerpaste_allow_local_images: false,
        /** *********************************powerpast结束***********************************/ // fontsize_formats:
        //   '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
        // font_formats:
        //   '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //字体样式
        lineheight_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5", //行高配置，也可配置成"12px 14px 16px 20px"这种形式
        // image_dimensions: true,
        height: props.height, //注：引入autoresize插件时，此属性失效
        // placeholder: '在这里输入文字',
        branding: false, //tiny技术支持信息是否显示
        resize: false, //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
        // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
        elementpath: false, //元素路径是否显示
        content_style: "", //直接自定义可编辑区域的css样式
        paste_data_images: true, //图片是否可粘贴
        toolbar_mode: "wrap", //工具栏换行
        images_upload_handler: (
          blobInfo: any,
          success: any,
          failure: any,
          progress: any
        ) => {
          if (blobInfo.blob().size / 1024 / 1024 > 50) {
            failure("文件大小超出2M");
            return;
          }
          /**
           * 判断文件是file还是blob
           */ // file
          if (blobInfo.blob().name) {
            const formData: any = new FormData();
            formData.append("multipartFile", blobInfo.blob());
            formData.append("type", 6);

            // post请求
            post("/xxx/xxx/xxx/xxx", formData).then(
              (res: any) => {
                let { code,message, customData } = res;
                if (message === "OK" && code === 200) {
                  success(customData[0].filePath);
                  console.log(customData[0].filePath);
                }
              }
            );
          } else {
            // blob转file
            const blob = blobInfo.blob(); // 生成随机数
            const randonNum = Math.random()
              .toString()
              .slice(1, 10)
              .split(".")
              .pop();
            const files = new window.File([blob], `${randonNum}.png`, {
              type: blob.type,
            });
            const formData: any = new FormData();
            formData.append("multipartFile", files);
            formData.append("type", 6);
            // post请求
            post("/xxx/xxx/xxx/xxx", formData).then(
              (res: any) => {
                let { code, message, customData } = res;
                if (message === "OK" && code === 200) {
                  success(customData[0].filePath);
                  console.log(customData[0].filePath);
                }
              }
            );
          }
        },
        // 上传视频
        media_url_resolver: function (
          data: { url: string },
          resolve: (arg0: { html: string }) => void
        ) {
          try {
            let videoUri = encodeURI(data.url);
            let embedHtml = `
              <span
                data-mce-selected="1"
                data-mce-object="video"
                data-mce-p-controls="controls"
                data-mce-p-controlslist="nodownload"
                data-mce-p-allowfullscreen="true"
                style="width: 320px;height:180px;display: block;"
                data-mce-p-src=${data.url} >
                <video src=${data.url} width="100%" height="100%" controls="controls" controlslist="nodownload">
                </video>
              </span>`;
            resolve({ html: embedHtml });
          } catch (e) {
            resolve({ html: "" });
          }
        },
      },
      contentValue: props.value,
      id: props.editId,
    });
    watch(
      () => props.value,
      (newvalue, oldvalue) => {
        state.contentValue = newvalue;
      }
    );
    onMounted(() => {
      tinymce.init({});
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style>
.wp_themeSkin table.mceToolbar {
  margin: 0 6px 2px;
  display: inline-table;
}
</style>
