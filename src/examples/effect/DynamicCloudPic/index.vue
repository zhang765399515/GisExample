<script setup lang='ts'>
import { load } from './map'

const rangeFun = () =>{
    load()
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="" @click="rangeFun">加载云图</el-button>
    </div>
</template>