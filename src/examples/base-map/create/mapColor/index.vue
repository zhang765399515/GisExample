<script setup lang='ts'>
import { reactive, render,createVNode,onMounted } from 'vue'
import {layerColor,load3dtileset} from "./map"
let options = reactive({
    gamma: 2.0, // 伽马值
    contrast: 1.5, // 对比度
    brightness: 0.8, // 亮度
    saturation: 1.2, // 饱和度
    hue: 0.1, // 色调
    enabled:false,
    glow:false,//发光
    shadows:false,
    highDynamicRange:false,
})
onMounted(() => {
    setTimeout(() => { 
        load3dtileset();
        modifyColor();
     }, 1000)
})
const modifyColor = () =>{
    const layer = window.viewer.imageryLayers._layers[0];
    layerColor(layer,options)
}
const clearAll =() =>{
    const layer = window.viewer.imageryLayers._layers[0];
    options = reactive({
        gamma: 1, // 伽马值
        contrast: 1, // 对比度
        brightness: 1, // 亮度
        saturation: 1, // 饱和度
        hue: 0.1, // 色调
        enabled:false,
        glow:false,//发光
        shadows:false,
        highDynamicRange:false,
    })
    layerColor(layer,options)
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="100px">
            <el-form-item label="伽马值">
                <el-slider  v-model="options.gamma" :step="0.1" :min="0" :max="10" @change="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="对比度">
                <el-slider v-model="options.contrast" :step="0.1" :min="0" :max="10" @change="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="亮度">
                <el-slider v-model="options.brightness" :step="0.1" :min="0" :max="10" @change="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="饱和度">
                <el-slider v-model="options.saturation" :step="0.1" :min="0" :max="10" @change="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="色调">
                <el-slider v-model="options.hue" :step="0.1" :min="0" :max="10" @change="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="发光">
                <el-switch v-model="options.enabled"  @change="modifyColor"/>
            </el-form-item>
            <el-form-item label="模糊">
                <el-switch v-model="options.glow"  @change="modifyColor"/>
            </el-form-item>
            <el-form-item label="阴影">
                <el-switch v-model="options.shadows"  @change="modifyColor"/>
            </el-form-item>
            <el-form-item label="高动态范围">
                <el-switch v-model="options.highDynamicRange"  @change="modifyColor"/>
            </el-form-item>
        </el-form>
        <el-button @click="clearAll">移除</el-button>
    </div>
</template>

<style lang='' scoped></style>