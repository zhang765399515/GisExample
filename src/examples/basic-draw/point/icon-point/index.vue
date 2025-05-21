<script setup lang='ts'>
import { reactive } from 'vue'
import { DrawBillboard } from "./map"

const billboardData = reactive({
    image: "image/light.png",
    scale: 0.05,
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
})

const createBillboard = new DrawBillboard({});
const addEntityBillboard = ()=>{
    createBillboard.startCreate(billboardData,(point)=>{
        billboardData.location = point
    });
}
const modifyEntityBillboard = ()=>{
    createBillboard.modifyLabel(billboardData);
}
const removeEntityBillboard = ()=>{
    createBillboard.clear()
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="100px">
            <el-form-item label="选择图标：">
                <el-input v-model="billboardData.image" @change="modifyEntityBillboard"></el-input>
            </el-form-item>
            <el-form-item label="大小：">
                <el-slider v-model="billboardData.scale"  @input="modifyEntityBillboard" :min="0.01" :step="0.01" :max="1"></el-slider>
            </el-form-item>
            <el-form-item label="经度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="billboardData.location.longitude" :min="-180" :max="180" :step="0.000001"
                        @input="modifyEntityBillboard" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="纬度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="billboardData.location.latitude" :min="-90" :max="90" :step="0.000001"
                        @input="modifyEntityBillboard" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="高度(m)：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="billboardData.location.height" :min="-10000" :max="10000" :step="1"
                        @input="modifyEntityBillboard" :precision="1"></el-input-number>
                </div>
            </el-form-item>
        </el-form>
        <el-button @click="addEntityBillboard">新增图标点</el-button>
        <el-button @click="removeEntityBillboard">清除</el-button>
    </div>
</template>