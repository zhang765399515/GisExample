
<script setup lang='ts'>
import { getCurrentCamera,flyTo} from './map';
let attributes = reactive({
    longitude: 0,
    latitude: 0,
    altitude: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
})
async function initLoad() {
    let position: any = getCurrentCamera();
    attributes.longitude = position.longitude
    attributes.latitude = position.latitude
    attributes.altitude = position.altitude
    attributes.heading = position.heading;
    attributes.pitch = position.pitch;
    attributes.roll = position.roll;
}
async function flyToCurrent() {
    flyTo(attributes);
}
onMounted(() => {
    setTimeout(() => { initLoad() }, 1000)
})
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" class="dhy_control-button" @click="initLoad">获取当前视角</el-button>
        <el-button type="primary" class="dhy_control-button" @click="flyToCurrent">定位当前视角</el-button>
        <el-form label-width="80px">
                <el-form-item label="经度">
                    <el-input v-model.number="attributes.longitude" type="number" :step="0.0001"></el-input>
                </el-form-item>
                <el-form-item label="纬度">
                    <el-input v-model.number="attributes.latitude" type="number" :step="0.0001"></el-input>
                </el-form-item>
                <el-form-item label="高度">
                    <el-input v-model.number="attributes.altitude" type="number" :step="1"></el-input>
                </el-form-item>
                <el-form-item label="方向角">
                    <el-input v-model="attributes.heading" type="number"></el-input>
                </el-form-item>
                <el-form-item label="俯仰角">
                    <el-input v-model="attributes.pitch" type="number"></el-input>
                </el-form-item>
                <el-form-item label="翻滚角">
                    <el-input v-model="attributes.roll" type="number"></el-input>
                </el-form-item>
            </el-form>
    </div>
</template>