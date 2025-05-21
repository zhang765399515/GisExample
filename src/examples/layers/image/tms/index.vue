<script setup lang='ts'>
import { onMounted } from 'vue'
import { loadTMSLayer } from './map'
onMounted(() => {
    setTimeout(() => { loadTMSLayer() }, 1000)
})
</script>

<template>
    <div></div>
</template>

<style lang='' scoped></style>