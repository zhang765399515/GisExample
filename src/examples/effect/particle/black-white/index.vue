<script setup lang='ts'>
import { addBlackWhite,removeBlackWhite} from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="addBlackWhite">开启黑白</el-button>
        <el-button type="primary" @click="removeBlackWhite">关闭黑白</el-button>
    </div>
</template>