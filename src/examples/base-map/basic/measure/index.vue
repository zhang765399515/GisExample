<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import {
    widgetsTools,
    pointTool,
    clearPoint,
    measureDistance,
    clearDistance,
    measureArea,
    clearArea,
    measureHeight,
    clearHeight
} from './map';
onMounted(() => {
    nextTick(() => {
        widgetsTools();
    });
});
const pointToolClick = () => {
    pointTool();
};
const clearPointClick = () => {
    clearPoint();
};
const distanceToolClick = () => {
    measureDistance();
};
const clearDistanceClick = () => {
    clearDistance();
};
const areaToolClick = () => {
    measureArea();
};
const clearAreaClick = () => {
    clearArea();
};
const heightToolClick = () => {
    measureHeight();
};
const clearHeightClick = () => {
    clearHeight();
};
</script>
<style>
/* @import url(PGEarth/Source/Widgets/widgets.css); */

#pgContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.tools {
    margin: 1px;
    position: absolute;
    left: 65px;
    top: 20px;
    width: auto;
    height: auto;
    background: rgba(42, 42, 42, 0.8);
    padding: 4px;
    border-radius: 4px;
    color: #ffffff;
}
</style>
<template>
    <div>
    <div class="tools">
        <button @click="pointToolClick()">点位量测</button>
        <button @click="clearPointClick()">清除点位</button>
        <button @click="distanceToolClick()">距离测量</button>
        <button @click="clearDistanceClick()">清除距离</button>
        <button @click="areaToolClick()">面积测量</button>
        <button @click="clearAreaClick()">清除面积</button>
        <button @click="heightToolClick()">高度测量</button>
        <button @click="clearHeightClick()">清除高度</button>
    </div>
    </div>
</template>
