<script setup lang='ts'>
import { loadTerrainLayer , terrainExaggeration} from './map'
import { reactive } from 'vue'

const openSplitSlider = () => {
    loadTerrainLayer()
}
const data = reactive({
    height:1
})
const exaggerationFun = () =>{
    terrainExaggeration(data.height)
}
</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <div><el-button @click="openSplitSlider">加载深圳高程</el-button></div>
        <div class="">
            <span>地形夸张： </span>
            <el-input-number v-model="data.height" @change="exaggerationFun" :min="-10" :max="10"></el-input-number>
        </div>
    </div>
</template>
<style lang="scss">
    .dhy_widget-main{
        div:first-child{
            width: 100%;
        }
    }
</style>