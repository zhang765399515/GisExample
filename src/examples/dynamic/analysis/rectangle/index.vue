<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { loadRectangle2 } from './map'

const rectangleFun = () =>{
    loadRectangle2()
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="" @click="rectangleFun">立体墙</el-button>
    </div>
</template>
<style>
</style>