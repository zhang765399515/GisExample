<script setup lang='ts'>
import { onMounted, reactive } from 'vue'
import { load,cloudChange } from './map'

const rangeFun = () => {
    load()
}
const guiConfig = ref({
    cloudCover: 0.5, //云覆盖度
    windSpeedRatio: 0.0002,//风速
    fogColor: 3.0,
    length: 5000.0,
    width: 5000.0,
    height: 1000,
    cloudThickness: 1000,//云层厚度
    windVectorX: 100,
    windVectorY: 0,
    windVectorZ: 100,
});
const change = () => {
    cloudChange(guiConfig.value)
}
setTimeout(() => {
    rangeFun();
},2000)
const aaa=ref(0)
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="" @click="rangeFun">加载</el-button>
        <div class="slider-demo-block">
            <span class="demonstration">云覆盖率</span>
            <el-slider v-model="guiConfig.cloudCover" @change="change" :step="0.01" :min="0" :max="1" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">风速</span>
            <el-slider v-model="guiConfig.windSpeedRatio" @change="change"  :step="0.0001" :min="0" :max="0.01" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">云颜色深度</span>
            <el-slider v-model="guiConfig.fogColor" @change="change"  :step="0.01" :min="0" :max="10" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">长</span>
            <el-slider v-model="guiConfig.length"  @change="change" :step="0.01" :min="0"  :max="10000" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">宽</span>
            <el-slider v-model="guiConfig.width" @change="change"  :step="0.01" :min="0" :max="10000" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">高</span>
            <el-slider v-model="guiConfig.height" @change="change"  :step="0.01" :min="0" :max="1000" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">方向X</span>
            <el-slider v-model="guiConfig.windVectorX" @change="change"  :step="0.01" :min="-100" :max="100" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">方向Y</span>
            <el-slider v-model="guiConfig.windVectorY" @change="change"  :step="0.01" :min="-100" :max="100" />
        </div>
        <div class="slider-demo-block">
            <span class="demonstration">方向Z</span>
            <el-slider v-model="guiConfig.windVectorZ" @change="change"  :step="0.01" :min="-100" :max="100" />
        </div>
    </div>
</template>
<style>
.dhy_widget-main{
    
    display: block !important;
}
.slider-demo-block{
    display: flex;
    justify-content: center;
    width: 300px;
    .demonstration{
        width: 120px;
    }
}
</style>