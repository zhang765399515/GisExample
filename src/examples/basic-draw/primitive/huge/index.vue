<script setup lang='ts'>
import { loadHugePromitiveData, loadHugeCustomPromitiveData } from './map'

const load = () => {
    loadHugePromitiveData();
}

const customLoad = () => {
    loadHugeCustomPromitiveData();
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" class="dhy_control-button" @click="load">加载PrimitiveCollection数据</el-button>
        <el-button type="primary" size="small" class="dhy_control-button" @click="customLoad">加载PrimitiveCollection(自定义着色器)</el-button>
    </div>
</template>