<!-- 
 Later - 加载tif格式高程数据
-->
<script setup lang='ts'>
import { onMounted } from 'vue';
import { loadElevationLayer } from './map'

onMounted(() => {
    setTimeout(() => {
        loadElevationLayer()
    }, 2000)
})
</script>

<template></template>
