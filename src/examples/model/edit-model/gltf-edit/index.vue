<script lang="ts" setup>
import { loadGltf,ModelEditHelper } from './map'
window.viewer.scene.debugShowFramesPerSecond = true;
const model = loadGltf()
const start = ()=>{
    const modelEdit = new ModelEditHelper(model,{
        helperModel:{
            scale:1,
            url:'model/axis_2.gltf',
            opacity:1,
            headingAngle:0,
            pitchAngle:0,
            rollAngle:0
        }
    })
    modelEdit.start();
}
</script>
<template>
    <div class="dhy_widget-main">
        <div class="virtual-borehole">
            <div>模型编辑：</div>
            <el-button type="primary" size="small" @click="start()">开始</el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .virtual-borehole{
        width: 100%;
    }
</style>