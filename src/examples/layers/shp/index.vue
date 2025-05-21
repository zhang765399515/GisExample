<script setup lang='ts'>
import { onMounted } from 'vue'
import { load3dtiles,loadShp,loadShp2,removeShp } from './map'
import polygonData from "./test1.json"
onMounted(()=>{
    setTimeout(()=>{
        load3dtiles();
    },1000)
})
const add = ()=>{
    // loadShp(polygonData,'polygon');
    loadShp2();
    
}
const remove = ()=>{
    removeShp('polygon')
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="add">添加</el-button>
        <el-button @click="remove">移除</el-button>
    </div>

</template>

<style lang='' scoped></style>