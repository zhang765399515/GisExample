<script setup lang='ts'>
setTimeout(() => {
    window.viewer.camera.flyTo({
    "destination": {
        "x": -2337496.0903005158,
        "y": 5278567.139573527,
        "z": 2969398.321504343
    },
    "orientation": {
        "heading": 6.283185307179586,
        "pitch": -1.570789519605868,
        "roll": 0
    },
    "duration": 1
});
 
},2000)
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