<script setup lang="ts">
import { loadTilesLayer, startToRoaming, stopToRoaming } from "./map";
</script>

<template>
  <div class="dhy_widget-main">
    <el-button type="primary" class="dhy_control-button" @click="loadTilesLayer">加载倾斜摄影</el-button>
    <el-button type="primary" class="dhy_control-button" @click="startToRoaming">开始漫游</el-button>
    <el-button type="primary" class="dhy_control-button" @click="stopToRoaming">关闭漫游</el-button>
  </div>
</template>
