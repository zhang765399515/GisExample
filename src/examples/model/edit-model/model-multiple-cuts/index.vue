<template>
</template>

<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { load3dtiles } from './map'
    onMounted(()=>{
        setTimeout(() => {
            load3dtiles();
        }, 2000);
    })
</script>