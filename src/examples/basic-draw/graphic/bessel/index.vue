<script setup lang='ts'>
import { onMounted } from 'vue'
import { widgetsBezierSpline } from './map'

onMounted(() => {
    setTimeout(() => { widgetsBezierSpline() }, 1000)
})
</script>

<template>
    <div></div>
</template>