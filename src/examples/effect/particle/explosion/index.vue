<script setup lang='ts'>
import { addExplosion,removeExplosion } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addExplosion">添加爆炸</el-button>
        <el-button type="primary" @click="removeExplosion">清除爆炸</el-button>
    </div>
</template>