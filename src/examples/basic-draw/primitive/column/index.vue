<script lang="ts" setup>
import { addColumn } from './map'
setTimeout(() => {
addColumn()
},2000)
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="addColumn">加载渐变柱子</el-button>
    </div>
</template>