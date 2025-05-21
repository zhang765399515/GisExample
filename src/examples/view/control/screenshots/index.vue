<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { saveToImage,load3dtiles } from "./map"

onMounted(() =>{
    setTimeout(()=>{
        load3dtiles();
    },1000)
}) 
const saveToImageFun = () =>{
    saveToImage(window.viewer);
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="saveToImageFun">场景出图</el-button>
    </div>
</template>