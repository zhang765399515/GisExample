<script setup lang='ts'>
import { lightPoint } from './map'
</script>

<template>
    <div style="position: absolute; left: 100px; top:50px">
        <el-button type="primary" size="small" @click="lightPoint(50)">点光源</el-button>
    </div>
</template>

<style lang='' scoped></style>