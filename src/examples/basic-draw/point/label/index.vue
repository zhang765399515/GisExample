<script setup lang='ts'>
import { DrawLabel } from "./map"
const labelData = reactive({
    name: "测试",
    fontSize:14,
    fontColor:"#fff",
    horizontalOrigin:"居中",
    verticalOrigin:"居中",
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
    showBackground:false,
    backgroundColor:"rgba(0,0,0,0.5)",
    paddingTop:10,
    paddingLeft:10
})
const createLabel = new DrawLabel({});
const addEntityLabel = ()=>{
    createLabel.startCreate(labelData,(point)=>{
        labelData.location = point
    });
}
const modifyEntityLabel = ()=>{
    createLabel.modifyLabel(labelData);
}
const removeEntityLabel = ()=>{
    createLabel.clear()
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="120px">
            <el-form-item label="名称：">
                <el-input v-model="labelData.name" @input="modifyEntityLabel"></el-input>
            </el-form-item>
            <el-form-item label="名称大小：">
                <el-slider v-model="labelData.fontSize"  @input="modifyEntityLabel"></el-slider>
            </el-form-item>
            <el-form-item label="名称颜色：">
                <el-color-picker v-model="labelData.fontColor" @change="modifyEntityLabel"></el-color-picker>
            </el-form-item>
            <el-form-item label="名称水平位置：">
                <el-radio-group v-model="labelData.horizontalOrigin" size="mini" @change="modifyEntityLabel">
                    <el-radio-button label="居中"></el-radio-button>
                    <el-radio-button label="居右"></el-radio-button>
                    <el-radio-button label="居左"></el-radio-button>
                  </el-radio-group>
            </el-form-item>
            <el-form-item label="名称垂直位置：">
                <el-radio-group v-model="labelData.verticalOrigin" size="mini" @change="modifyEntityLabel">
                    <el-radio-button label="居中"></el-radio-button>
                    <el-radio-button label="居上"></el-radio-button>
                    <el-radio-button label="居下"></el-radio-button>
                  </el-radio-group>
            </el-form-item>
            <el-form-item label="经度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="labelData.location.longitude" :min="-180" :max="180" :step="0.000001"
                        @input="modifyEntityLabel" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="纬度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="labelData.location.latitude" :min="-90" :max="90" :step="0.00001"
                        @input="modifyEntityLabel" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="高度(m)：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="labelData.location.height" :min="-10000" :max="10000" :step="1"
                        @input="modifyEntityLabel" :precision="1"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="开启背景：">
                <div class="el-form-item-flex">
                    <el-switch v-model="labelData.showBackground" active-color="#409eff" inactive-color="#918d8d" @change="modifyEntityLabel"> </el-switch>
                </div>
            </el-form-item>
            <el-form-item label="背景颜色：" v-show="labelData.showBackground">
                <el-color-picker v-model="labelData.backgroundColor" @change="modifyEntityLabel" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="上下边距：" v-show="labelData.showBackground">
                <el-input-number v-model="labelData.paddingTop" :min="0" :max="100" @input="modifyEntityLabel"></el-input-number>
            </el-form-item>
            <el-form-item label="左右边距：" v-show="labelData.showBackground">
                <el-input-number v-model="labelData.paddingLeft" :min="0" :max="100" @input="modifyEntityLabel"></el-input-number>
            </el-form-item>
        </el-form>
        <el-button @click="addEntityLabel">新增文字标签</el-button>
        <el-button @click="removeEntityLabel">清除</el-button>
    </div>
</template>

<style lang='' scoped></style>