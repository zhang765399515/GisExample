<script setup lang="ts">
import { onMounted } from 'vue';
import { loadGltf } from "./map";
onMounted(() => {
})
const add = ()=>{
    loadGltf();
}
</script>
<template>
    <div class="dhy_widget-main">
        <el-button @click="add">添加gltf</el-button>
    </div>
</template>