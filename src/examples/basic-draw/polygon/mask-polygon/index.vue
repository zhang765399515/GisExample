<script setup lang='ts'>
import { reactive, render,createVNode,onMounted } from 'vue'
import {addMasker} from "./map"
const createMaskerFun = ()=>{
    addMasker()
}

</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="createMaskerFun">生成</el-button>
    </div>
</template>
<style lang="scss">


</style>