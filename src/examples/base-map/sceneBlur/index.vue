<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { loadGltf,loadData } from './map'
let depthOfField
onMounted(() => {
    setTimeout(() => { 
        loadGltf();
        depthOfField = loadData();
        depthOfField.enabled = true;
        depthOfField.uniforms.delta =1;
        depthOfField.uniforms.sigma = 3.78;
        depthOfField.uniforms.stepSize = 2.46;
    }, 1000)
})
const options = reactive({
    focalDistance:1,
    stepSize:1
})

const updatePostProcessFocalDistance = ()=> {
    depthOfField.uniforms.focalDistance =options.focalDistance;

}
const updatePostProcessStepSize = ()=>{
    depthOfField.uniforms.stepSize =options.stepSize;
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="100px">
            <el-form-item label="焦距">
                <el-slider v-model="options.focalDistance" :max="200" @input="updatePostProcessFocalDistance"></el-slider>
            </el-form-item>
            <el-form-item label="模糊度">
                <el-slider v-model="options.stepSize" :max="10" @input="updatePostProcessStepSize"></el-slider>
            </el-form-item>
        </el-form>
    </div>
</template>