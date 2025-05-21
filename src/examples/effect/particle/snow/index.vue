<script setup lang='ts'>
import { addSnow, removeSnow } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addSnow">开启下雪</el-button>
        <el-button type="primary" @click="removeSnow">关闭下雪</el-button>
    </div>
</template>