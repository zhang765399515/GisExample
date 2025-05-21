<script setup lang='ts'>
import { reactive } from 'vue'
import { loadEntityPoint, pointEntityArr } from "./map"

const pointData = reactive({
    name: "",
    size: 1,
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
    color: "#ff0000"
})

const changePoint = (type: string) => {
    console.log('type: ', type);
}

</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="loadEntityPoint">新增点</el-button>

        <el-form label-position="right" label-width="100px">
            <el-form-item label="点名称：">
                <el-input v-model="pointData.name" @change="changePoint('pointName')"></el-input>
            </el-form-item>
            <el-form-item label="大小：">
                <el-slider v-model="pointData.size"  @input="changePoint('size')"></el-slider>
            </el-form-item>
            <el-form-item label="经度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.longitude" :min="-180" :max="180" :step="0.000001"
                        @input="changePoint('location')" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="纬度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.latitude" :min="-90" :max="90" :step="0.000001"
                        @input="changePoint('location')" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="高度(m)：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.height" :min="-10000" :max="10000" :step="1"
                        @input="changePoint('location')" :precision="1"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="颜色：">
                <el-color-picker v-model="pointData.color" @change="changePoint('color')"></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>