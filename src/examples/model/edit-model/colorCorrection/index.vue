<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { load3dtiles } from './map'

onMounted(() => {
    setTimeout(() => { load3dtiles() }, 1000)
})
const tilesetData = reactive({
    enabled:false,
    focalDistance: 87,
    delta: 1.0,
    sigma: 3.78,
    stepSize: 2.46
})
const modifyColor = () =>{
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="150px">
            <!-- <el-form-item label="是否显示名称：">
                <el-switch v-model="pointData.isLabel"  @change="modifyEntityPoint"/>
            </el-form-item> -->
            <el-form-item label="焦距：">
                <el-slider v-model="tilesetData.focalDistance" :min="0" :max="500"  @input="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="对比度：">
                <el-slider v-model="tilesetData.delta" :min="0.1" :max="2" :step="0.01" @input="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="色调：">
                <el-slider v-model="tilesetData.sigma" :min="0.5" :max="5" :step="0.01" @input="modifyColor"></el-slider>
            </el-form-item>
            <el-form-item label="饱和度：">
                <el-slider v-model="tilesetData.stepSize" :min="0" :max="7" :step="0.01" @input="modifyColor"></el-slider>
            </el-form-item>

        </el-form>
    </div>
</template>