<script setup lang='ts'>
import { reactive, render,createVNode,onMounted } from 'vue'
import { drawWater,load3dtileset } from "./map"
import { DrawPolyline } from "../../polyline/polyline/map"
let waterData = reactive({
    color:'#ff0000',
    baseWaterColor: "rgba(47,131,137,0.6)",
    frequency: 1000,
    animationSpeed: 0.01,
    amplitude: 100.0,
})
onMounted(() => {
    setTimeout(() => { load3dtileset() }, 1000)
})
const createLabel = new DrawPolyline({});
const loadWater = new drawWater(waterData);
const createFun = ()=>{
    createLabel.startCreate(waterData,(value)=>{
        loadWater.startCreate(value);
    createLabel.clear();
    });
}
const removeFun = ()=>{
    loadWater.clear();
}
const modifyFun = ()=>{
    console.log(waterData.baseWaterColor)
    loadWater.modifyWater(waterData)
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="100px">
            <el-form-item label="频率：">
                <el-slider v-model="waterData.frequency"  @input="modifyFun" :min="100" :max="10000"></el-slider>
            </el-form-item>
            <el-form-item label="动画速度：">
                <el-slider v-model="waterData.animationSpeed"  @input="modifyFun" :min="0.01" :max="1" :step="0.01"></el-slider>
            </el-form-item>
            <el-form-item label="振幅：">
                <el-slider v-model="waterData.amplitude"  @input="modifyFun" :min="1" :max="1000"></el-slider>
            </el-form-item>
            <el-form-item label="颜色：">
                <el-color-picker v-model="waterData.baseWaterColor" @change="modifyFun" show-alpha></el-color-picker>
            </el-form-item>
        </el-form>
        <el-button @click="createFun">绘制水面范围</el-button>
        <!-- <el-button @click="modifyFun">修改水面</el-button> -->
        <el-button @click="removeFun">清除水面</el-button>
    </div>
</template>
<style lang="scss">


</style>