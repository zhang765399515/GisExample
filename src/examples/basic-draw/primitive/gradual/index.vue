<script lang="ts" setup>
import { loadRegions } from './map'
setTimeout(() => {
    loadRegions()
}, 1000)
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadRegions">加载渐变行政区划面</el-button>
    </div>
</template>