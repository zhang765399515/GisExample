<script setup lang='ts'>
import { createParticleSystem,removeFire } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="createParticleSystem">开启喷泉</el-button>
        <el-button type="primary" @click="removeFire">关闭喷泉</el-button>
    </div>
</template>