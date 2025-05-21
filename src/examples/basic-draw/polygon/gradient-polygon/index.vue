<script setup lang='ts'>
import { load } from "./map"
onMounted(() => {
    setTimeout(() => {
        load()  
    }, 1000);
})
</script>

<template>
    <div class="dhy_widget-main">
    </div>
</template>
<style lang="scss">


</style>