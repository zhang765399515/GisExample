<script setup lang='ts'>
import { addLightning,removeLightning} from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addLightning">开启雷电</el-button>
        <el-button type="primary" @click="removeLightning">关闭雷电</el-button>
    </div>
</template>