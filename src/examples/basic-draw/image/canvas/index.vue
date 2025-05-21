<script setup lang='ts'>
import { loadMeteorology } from './map'
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="loadMeteorology">加载气象云图</el-button>
    </div>
</template>

<style lang='' scoped></style>