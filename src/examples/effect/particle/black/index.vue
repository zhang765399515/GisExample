<script setup lang='ts'>
import { addBlack,removeBlack} from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addBlack">开启黑夜</el-button>
        <el-button type="primary" @click="removeBlack">关闭黑夜</el-button>
    </div>
</template>