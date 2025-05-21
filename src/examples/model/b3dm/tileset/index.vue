<script setup lang='ts'>
import { onMounted } from 'vue'
import { load3dtiles } from '../tileset/map'

onMounted(() => {
    setTimeout(() => { load3dtiles() }, 1000)
})
</script>

<template>
    <div></div>
</template>