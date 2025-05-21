<script setup lang='ts'>
import { onMounted } from 'vue'
import { loadPhotoeffectScan } from './map'

onMounted(() => {
    setTimeout(() => {
        loadPhotoeffectScan();
    }, 1000)
})

</script>

<template>
    <div></div>
</template>

<style lang='' scoped></style>