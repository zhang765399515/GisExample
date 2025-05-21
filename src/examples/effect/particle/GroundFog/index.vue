<script setup lang='ts'>
import { addFog,removeFog ,addTile} from './map';
</script>
<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addFog">开启雾</el-button>
        <el-button type="primary" @click="removeFog">关闭雾</el-button>
        <el-button type="primary" @click="addTile">添加默认高程</el-button>
    </div>
</template>