<script setup lang='ts'>
import { reactive, render,createVNode,onMounted,ref } from 'vue'
import { Cartesian3, Cartesian2 } from 'geokey-gis';
import { loadVideo } from "./map"
const videoPlayer = ref<HTMLVideoElement | null>(null);
 onMounted(()=>{
 })
 const playVideo = ()=>{
    if(videoPlayer.value){
        loadVideo({
            position: Cartesian3.fromDegrees(113.94942076704119,22.5548076696712, 150),
            videoElement: videoPlayer.value,
            dimensions: new Cartesian2(400.0, 200.0),
        })
        videoPlayer.value.play();

    }
 }
</script>

<template>
    <div class="dhy_widget-main">
        <video ref="videoPlayer"
               style="display: none"
               muted
               autoplay
               loop
               controls>
          <!-- <source src="model/video.mp4" type="video/mp4"> -->
        </video>
        <el-button @click="playVideo">播放</el-button>
    </div>
</template>
<style lang="scss">


</style>