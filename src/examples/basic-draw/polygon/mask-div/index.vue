<script setup lang='ts'>
</script>

<template>
    <div class="mask-div">
    </div>
</template>
<style lang="scss">
    .mask-div{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        top: 60px;
        z-index: 999;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-image: radial-gradient(rgba(0, 0, 0, 0.1) 10%,rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.6) 60%, rgb(0, 0, 0) 90%);
    }

</style>