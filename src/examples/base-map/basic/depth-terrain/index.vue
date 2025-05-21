<!--
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2024-04-12 11:31:46
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2024-04-15 16:21:29
 * @FilePath: \vite-pgEarth\src\examples\base-map\basic\depth-terrain\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang='ts'>
import { onMounted, ref, nextTick } from 'vue';
import { initTerrain, addTestPoint, openDepthTerrain, closeDepthTerrain } from './map';
</script>

<template>
    <div class="dhy_widget-main">
        <!-- <el-button type="primary" class="dhy_control-button" @click="initTerrain">加载高程</el-button> -->
        <el-button type="primary" class="dhy_control-button" @click="addTestPoint">测试点</el-button>
        <el-button type="primary" class="dhy_control-button" @click="openDepthTerrain">开启深度拾取</el-button>
        <el-button type="primary" class="dhy_control-button" @click="closeDepthTerrain">关闭深度拾取</el-button>
    </div>
</template>