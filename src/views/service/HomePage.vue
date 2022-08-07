<template>
  <div id="wrapper" v-cloak>
    <div style="padding-bottom: 10px">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="height: 1px; margin: 10px 0; background-color: burlywood"></div>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div id="view" style="width: 100%; height: 520px; margin: 0 auto">
            <div id="picture-left" style="height: 500px"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div id="click" style="width: 100%; height: 520px; margin: 0 auto">
            <div id="picture-right" style="height: 500px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="padding: 5px 0">
      <el-col :span="24">
        <el-card>
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div id="polyline" style="width: 100%; height: 800px; margin: 0 auto">
            <div id="pageBody" align="center">
              <b align="center" style="color: #696969">
                用户分布地区（国内-省份）
              </b>
              <div
                id="box"
                style="width: 100%; height: 800px; margin-top: 10px"
              ></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="padding: 5px 0">
      <el-col :span="24">
        <el-card>
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div
            id="bar"
            style="width: 100%; height: 400px; margin: 0 auto"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import post from "@/http/axios";
import * as echarts from "echarts";
// 引入中国地图数据
import "../../js/china";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
  components: {},
  props: {},
  setup() {
    // 页面数据
    const state = reactive({
      //地图数据
      data: [{ name: "", value: 0 }],
      // data: [
      //   { name: "北京", value: 35 },
      //   { name: "天津", value: 12 },
      //   { name: "上海", value: 30 },
      //   { name: "重庆", value: 92 },
      //   { name: "河北", value: 25 },
      //   { name: "河南", value: 20 },
      //   { name: "云南", value: 50 },
      //   { name: "辽宁", value: 30 },
      //   { name: "黑龙江", value: 80 },
      //   { name: "湖南", value: 20 },
      //   { name: "安徽", value: 24 },
      //   { name: "山东", value: 40 },
      //   { name: "新疆", value: 36 },
      //   { name: "江苏", value: 13 },
      //   { name: "浙江", value: 24 },
      //   { name: "江西", value: 15 },
      //   { name: "湖北", value: 41 },
      //   { name: "广西", value: 41 },
      //   { name: "甘肃", value: 17 },
      //   { name: "山西", value: 27 },
      //   { name: "内蒙古", value: 27 },
      //   { name: "陕西", value: 97 },
      //   { name: "吉林", value: 88 },
      //   { name: "福建", value: 19 },
      //   { name: "贵州", value: 94 },
      //   { name: "广东", value: 89 },
      //   { name: "青海", value: 35 },
      //   { name: "西藏", value: 97 },
      //   { name: "四川", value: 51 },
      //   { name: "宁夏", value: 56 },
      //   { name: "海南", value: 54 },
      //   { name: "台湾", value: 48 },
      //   { name: "香港", value: 49 },
      //   { name: "澳门", value: 34 },
      //   { name: "南海诸岛", value: 0 },
      // ],
    });
    // 方法体
    const methods = {
      //饼图
      drawPicLeft() {
        let chartDom: any = document.getElementById("picture-left");
        let myChart = echarts.init(chartDom);
        let option;
        option = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            top: "5%",
            left: "center",
          },
          series: [
            {
              name: "人数：",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "40",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1048, name: "成都" },
                { value: 735, name: "重庆" },
                { value: 580, name: "北京" },
                { value: 484, name: "泸州" },
                { value: 300, name: "青城山" },
              ],
            },
          ],
        };
        option && myChart.setOption(option);
      },
      //柱状、折线图
      drawPicRight() {
        let chartDom: any = document.getElementById("picture-right");
        let myChart = echarts.init(chartDom);
        let option;
        option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: ["男性用户", "女性用户", "当日注册人数"],
          },
          xAxis: [
            {
              type: "category",
              data: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],
              axisPointer: {
                type: "shadow",
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "每周注册人数视图：",
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                //{value}
                formatter: "",
              },
            },
            {
              type: "value",
              name: "人数",
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                formatter: "{value} 人",
              },
            },
          ],
          series: [
            {
              name: "男性用户",
              type: "bar",
              data: [2, 8, 5, 12, 16, 36, 44, 55],
            },
            {
              name: "女性用户",
              type: "bar",
              data: [4, 6, 3, 10, 20, 44, 46, 55],
            },
            {
              name: "当日注册期望数",
              type: "line",
              yAxisIndex: 1,
              data: [5, 10, 20, 40, 60, 75, 80, 100],
            },
          ],
        };

        option && myChart.setOption(option);
      },
      // 地图
      drawChina() {
        // 初始化echarts实例
        var myEcharts = echarts.init(document.getElementById("box"));
        document.getElementById("box").style.width = 1100 + "px";
        document.getElementById("box").style.height = 1100 + "px";
        myEcharts.resize();
        var option = {
          title: {},
          //这里设置提示框
          tooltip: {
            //数据项图形触发
            trigger: "item",
            //提示框浮层的背景颜色。
            backgroundColor: "#00FFFF",
            //字符串模板(地图): {a}（系列名称），{b}（区域名称），{c}（合并数值）,{d}（无）
            formatter: "地区：{b}<br/>人数：{c}",
          },
          visualMap: {
            //视觉映射组件
            show: true,
            x: "left",
            y: "top",
            // min: 10,
            // max: 50,
            // text: ['0~10', '10~20', '20~30', '30~40', '40~50', '50~500'],
            //拖拽时，是否实时更新
            realtime: false,
            splitList: [
              { start: 25, end: 500 },
              { start: 20, end: 25 },
              { start: 15, end: 20 },
              { start: 10, end: 15 },
              { start: 5, end: 10 },
              { start: 0, end: 5 },
            ],
            color: [
              "#5475f5",
              "#9feaa5",
              "#85daef",
              "#74e2ca",
              "#e6ac53",
              "#9fb5ea",
            ],
          },
          legend: {},
          series: [
            {
              name: "人数",
              type: "map",
              mapType: "china",
              roam: false, //是否开启鼠标缩放和平移漫游
              itemStyle: {
                //地图区域的多边形 图形样式
                //是图形在默认状态下的样式
                label: {
                  show: true, //是否显示标签
                  textStyle: {
                    color: "black",
                  },
                },
                zoom: 1.5, //地图缩放比例,默认为1
                emphasis: {
                  //是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                  label: { show: true },
                },
              },
              top: "3%", //组件距离容器的距离
              data: state.data,
              //  设置形状，类型包括：circle，rect ，roundRect，triangle，diamond，pin，arrow，none
              icon: "circle",
              // 设置宽度
              itemWidth: 10,
              // 设置高度
              itemHeight: 10,
              // 设置间距
              itemGap: 20,
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myEcharts.setOption(option);
      },
    };
    // 页面默认请求
    onMounted(() => {
      request.getcityData();
      methods.drawPicLeft();
      methods.drawPicRight();
      // methods.drawChina();
    });
    // 请求
    const request = {
      getcityData() {
        // 请求体数据
        const data = {
          customData: {},
        };
        // post请求
        post("xx/xx/xx/xx", data).then((res: any) => {
          // console.log(res);
          let { code, customData } = res;
          if (code === 200) {
            state.data = customData;
            methods.drawChina();
          }
        });
      },
    };
    return { ...methods, ...toRefs(state) };
  },
});
</script>

<style>
</style>
