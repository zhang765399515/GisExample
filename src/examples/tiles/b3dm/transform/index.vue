<script setup lang="ts">
import { reactive, watch } from 'vue'
import { load3dtiles, getModelPosition, tilesetRotate } from "./map";


let modelAttributes = reactive({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    longitude: 0,
    latitude: 0,
    altitude: 0,
    multiple: 1
})

async function initLoad() {
    await load3dtiles();
    let position: any = getModelPosition();
    modelAttributes.longitude = position.longitude
    modelAttributes.latitude = position.latitude
    modelAttributes.altitude = position.altitude
}

watch(modelAttributes, (x, y) => {
    tilesetRotate(x)
})

</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="initLoad">加载倾斜摄影模型</el-button>
            <el-form label-width="80px">
                <el-form-item label="比例">
                    <el-input v-model.number="modelAttributes.multiple" type="number" :min="0.1" :step="0.1"></el-input>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input v-model.number="modelAttributes.longitude" type="number" :step="0.0001"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input v-model.number="modelAttributes.latitude" type="number" :step="0.0001"></el-input>
                </el-form-item>
                <el-form-item label="高度">
                    <el-input v-model.number="modelAttributes.altitude" type="number" :step="1"></el-input>
                </el-form-item>
                <el-form-item label="X轴旋转">
                    <el-slider v-model="modelAttributes.rotateX" :min="-90" :max="90" :step="1"></el-slider>
                </el-form-item>
                <el-form-item label="Y轴旋转">
                    <el-slider v-model="modelAttributes.rotateY" :min="-90" :max="90" :step="1"></el-slider>
                </el-form-item>
                <el-form-item label="Z轴旋转">
                    <el-slider v-model="modelAttributes.rotateZ" :min="-90" :max="90" :step="1"></el-slider>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>