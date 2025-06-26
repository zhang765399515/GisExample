<script setup lang="ts">
import { ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import { loadTilesLayer, startToRoaming, stopToRoaming, roamCollision,removeTilesLayer } from './map';
const roamOperate = new roamCollision();
var echart;

const points = ref([]);
const startDrawPath = () => {
  roamOperate.startDrawPath(val => {
    points.value.push(val);
    if (points.value.length > 1) {
      roamOperate.loadLine(points.value);
    }
  });
};
const analyzeHeight = ref([]);
const analyzeCollision = () => {
  roamOperate.analyzeCollision(points.value, val => {
    analyzeHeight.value = [];
    val.forEach(e => {
      analyzeHeight.value.push(e.height);
    });
    option.series[0].data = analyzeHeight.value;
    echart.setOption(option);
  });
};
const changeFit = () => {
  roamOperate.changeFit();
};
const heightChange = val => {
  nextTick(() => {
    roamOperate.loadLine(points.value);
  });
};
const startOrientationRoam = () => {
  roamOperate.startRoam(points.value);
};
const stopOrientationRoam = () => {
  roamOperate.startRoam(points.value);
};
const myChart = ref();
var option = {
  grid: {
    top: 10,
    left: 35,
    right: 10,
    bottom: 10
  },
  xAxis: {
    type: 'category',
    show: false
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
};
setTimeout(() => {
  echart = echarts.init(myChart.value);
  // 使用刚指定的配置项和数据显示图表。
  echart.setOption(option);
}, 1000);
</script>

<template>
  <div class="dhy_widget-main roam">
    <div>
      <el-button type="primary" class="dhy_control-button" @click="loadTilesLayer">加载倾斜摄影</el-button>
      <el-button type="primary" class="dhy_control-button" @click="removeTilesLayer">移除</el-button>
      <el-button type="primary" class="dhy_control-button" @click="startDrawPath">绘制漫游路径</el-button>
      <el-button type="primary" class="dhy_control-button" @click="changeFit">更改线的贴合状态</el-button>
      <el-button type="primary" class="dhy_control-button" @click="analyzeCollision">分析碰撞数据</el-button>
      <div>
        <el-button type="primary" class="dhy_control-button" @click="startOrientationRoam">开始漫游</el-button>
        <el-button type="primary" class="dhy_control-button" @click="stopOrientationRoam">关闭漫游</el-button>
      </div>
      <div>
        <el-button type="primary" class="dhy_control-button" @click="startToRoaming">开始漫游</el-button>
        <el-button type="primary" class="dhy_control-button" @click="stopToRoaming">关闭漫游</el-button>
      </div>
    </div>
    <div class="pointData">
      <el-collapse accordion>
        <el-collapse-item :title="'点位' + (index + 1)" v-for="(item, index) in points" :key="index">
          <div class="operate-module">
            <div class="operate-module-title">坐标 :</div>
            <div>
              <span>经度：{{ item.longitude }} 纬度：{{ item.latitude }}</span>
              <!-- <el-input v-model="item.point"></el-input> -->
            </div>
          </div>

          <div class="operate-module">
            <div class="operate-module-title depth">深度 :</div>
            <div class="operate-module-speed">
              <el-input-number v-model="item.height" @change="heightChange" placeholder="请输入半径"></el-input-number>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="echartsModule">
      <div class="echarts" ref="myChart"></div>
    </div>
  </div>
</template>
<style lang="scss">
.roam {
  .pointData {
    width: 100%;
  }
  .dhy_control-button {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-collapse {
    border: 0;
    margin-top: 20px;
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
      margin-bottom: 2px;
      padding-left: 10px;
      background: rgba(41, 97, 159, 1);
      border: 0;
      color: #fff;
      font-size: 16px;
    }
    .el-collapse-item__wrap {
      background: rgba(39, 83, 127, 0.5);
      border: 0;
      .el-collapse-item__content {
        padding: 5px 12px 0px 12px;
        color: #fff;
        font-size: 16px;
        .operate-module {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          .operate-module-title {
            margin-right: 10px;
            flex-shrink: 0;
          }
          .operate-module-speed {
            width: 100%;
            .el-input-number {
              width: 100%;
            }
          }
          .depth {
          }
        }
        .el-input {
          .el-input__inner {
            border-radius: 0;
            border: 1px solid rgba(66, 106, 129);
            height: 32px;
          }
        }
      }
    }
  }
  .echartsModule {
    width: 100%;
    height: 200px;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
