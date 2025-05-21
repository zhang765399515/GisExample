<script setup lang="ts">
import { onMounted } from 'vue';
import { loadGltf,load3dtiles,mapColor } from "./map";
onMounted(() => {
    setTimeout(() => {
        mapColor()
    }, 1000)
})
const add = ()=>{
    load3dtiles();
    loadGltf();
}
</script>
<template>
    <div class="dhy_widget-main">
        <el-button @click="add">添加白膜</el-button>
    </div>
</template>