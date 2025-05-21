<script setup lang='ts'>
import { reactive, render,createVNode,onMounted,ref } from 'vue'
import { Cartesian3, Cartesian2 } from 'geokey-gis';
import { loadGif } from "./map"
 onMounted(()=>{
 })
 const playGif = ()=>{
    loadGif({
        position: Cartesian3.fromDegrees(113.94942076704119,22.5548076696712, 150),
        url:"image/1.gif"
    })
 }
</script>

<template>
    <div class="dhy_widget-main">
        <div id="gif-div" style="display:none"></div>
        <el-button @click="playGif">播放</el-button>
    </div>
</template>
<style lang="scss">


</style>