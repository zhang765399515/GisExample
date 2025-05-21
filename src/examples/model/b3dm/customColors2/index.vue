<script setup lang="ts">
import { onMounted } from 'vue';
import { load3dtiles } from "./map";
onMounted(() => {
})
const add = ()=>{
    load3dtiles();
}
</script>
<template>
    <div class="dhy_widget-main">
        <el-button @click="add">添加白膜</el-button>
    </div>
</template>