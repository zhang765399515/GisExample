<script setup>
import { openViewshedAnalysis, stopViewshedAnalysis } from "./map"
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="openViewshedAnalysis">开启可视域分析</el-button>
        <el-button @click="stopViewshedAnalysis">关闭可视域分析</el-button>
    </div>
</template>