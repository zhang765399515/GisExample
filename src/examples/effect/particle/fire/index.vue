<script setup lang='ts'>
import { addFire,removeFire } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addFire">添加火焰</el-button>
        <el-button type="primary" @click="removeFire">清除火焰</el-button>
    </div>
</template>