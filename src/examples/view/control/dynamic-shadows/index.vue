<template>
    <div class="dhy_widget-main">
    </div>
</template>

<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { load } from './map'
onMounted(() => {
    setTimeout(() => {
        load();
    },2000)
})
</script>
<style lang="scss">
    .dhy_base-map{
        background-size: 100% 100%
    }
</style>