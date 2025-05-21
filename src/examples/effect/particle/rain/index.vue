<script setup lang='ts'>
import { addRain,removeRain } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addRain">开启下雨</el-button>
        <el-button type="primary" @click="removeRain">关闭下雨</el-button>
    </div>
</template>