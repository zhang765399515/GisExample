<script setup lang='ts'>
import { addCloud} from './map';
setTimeout(() => {
    addCloud()
}, 2000)
</script>
<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addCloud">加载云</el-button>
    </div>
</template>