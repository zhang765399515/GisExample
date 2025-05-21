<script setup>
import { sunlightAnalysis, stopSSunlightAnalysis } from "./map"
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="sunlightAnalysis">开启日照分析</el-button>
        <el-button @click="stopSSunlightAnalysis">关闭日照分析</el-button>
    </div>
</template>