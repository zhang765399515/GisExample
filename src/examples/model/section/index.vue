<script setup lang='ts'>
import { startDraw,section,cancel } from './map'

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="startDraw">
            开始绘制
        </el-button>
        <el-button type="primary" class="dhy_control-button" @click="section">
            裁剪
        </el-button>
        <el-button type="primary" class="dhy_control-button" @click="cancel">
            移除所有
        </el-button>
    </div>
</template>