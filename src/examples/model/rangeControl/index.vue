<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { load3dtiles,rangeControl } from './map'
let tile 
onMounted(() => {
    setTimeout(() => { 
        tile = load3dtiles() 
    }, 1000)
})

const rangeFun = () =>{
    rangeControl(tile)
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="" @click="rangeFun">限制相机范围</el-button>
    </div>
</template>