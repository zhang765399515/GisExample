<script setup lang='ts'>
import { addNight,removeNight} from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addNight">开启夜视</el-button>
        <el-button type="primary" @click="removeNight">关闭夜视</el-button>
    </div>
</template>