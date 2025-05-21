<script setup lang='ts'>
import { reactive,onMounted } from 'vue'
import { loadEntityPoint, DrawPoint } from "./map"
import { Draw } from "./point"
import { HeightReference,Color,NearFarScalar,DistanceDisplayCondition } from "geokey-gis"
let draw
onMounted(()=>{
    setTimeout(()=>{
        draw = Draw(window.viewer)
    },1000)
})
const pointData = reactive({
    name: "测试",
    size: 10,
    fontSize:14,
    fontColor:"#fff",
    horizontalOrigin:"居中",
    verticalOrigin:"居中",
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
    color: "#ff0000",
    isOutLine:false,
    outlineColor:"#ff0000",
    outlineWidth:5,
    isLabel:false,
    isScaleByDistance:false,
    scaleByDistance:{
        near:1000000,
        nearValue:0.1,
        far:10,
        farValue:1
    },
    isDistanceDisplayCondition:false,
    distanceDisplayCondition:{
        near:1000000,
        far:0,
    },
    isDisableDepthTestDistance:false
})
const createPoint = new DrawPoint({});
const addEntityPoint = ()=>{
    createPoint.startCreate(pointData,(point)=>{
        pointData.location = point
    });
}
const modifyEntityPoint = ()=>{
    createPoint.modifyPoint(pointData);
}
const removeEntityPoint = ()=>{
    createPoint.clear()
}
const addPoint = ()=>{
    draw.drawPointGraphics({
        style:{
            pixelSize:10,//大小
            heightReference: HeightReference.NONE, //NONE绝对高度，CLAMP_TO_GROUND夹在地形上，RELATIVE_TO_GROUND贴地形
            color:Color.fromCssColorString('rgba(255,0,0,1)'),//颜色
            outlineColor:Color.fromCssColorString('rgba(255,0,0,1)'),//边框颜色
            outlineWidth:5,//边框宽度
            scaleByDistance: new NearFarScalar(1000000,0.1,10,1),//根据距离缩放
            translucencyByDistance:new NearFarScalar(1000000,0,1000,1),//根据距离设置透明度
            distanceDisplayCondition:new DistanceDisplayCondition(10, 20000),//指定相机多远的距离显示
            disableDepthTestDistance:Number.POSITIVE_INFINITY  //深度检测距离
        }
    });
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-form label-position="right" label-width="150px">
            <el-form-item label="点大小：">
                <el-slider v-model="pointData.size"  @input="modifyEntityPoint"></el-slider>
            </el-form-item>
            <el-form-item label="颜色：">
                <el-color-picker v-model="pointData.color" @change="modifyEntityPoint"></el-color-picker>
            </el-form-item>
            <el-form-item label="是否显示边框：">
                <el-switch v-model="pointData.isOutLine" @change="modifyEntityPoint"/>
            </el-form-item>
            <div v-show="pointData.isOutLine">
                <el-form-item label="边框颜色：">
                    <el-color-picker v-model="pointData.outlineColor" @change="modifyEntityPoint"></el-color-picker>
                </el-form-item>
                <el-form-item label="边框宽度：">
                    <el-slider v-model="pointData.outlineWidth"  @input="modifyEntityPoint"></el-slider>
                </el-form-item>
            </div>
            <el-form-item label="是否显示名称：">
                <el-switch v-model="pointData.isLabel"  @change="modifyEntityPoint"/>
            </el-form-item>
            <div v-show="pointData.isLabel">
                <el-form-item label="点名称：">
                    <el-input v-model="pointData.name" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="名称大小：">
                    <el-slider v-model="pointData.fontSize"  @input="modifyEntityPoint"></el-slider>
                </el-form-item>
                <el-form-item label="名称颜色：">
                    <el-color-picker v-model="pointData.fontColor" @change="modifyEntityPoint"></el-color-picker>
                </el-form-item>
                <el-form-item label="名称水平位置：">
                    <el-radio-group v-model="pointData.horizontalOrigin" size="mini" @change="modifyEntityPoint">
                        <el-radio-button label="居中"></el-radio-button>
                        <el-radio-button label="居右"></el-radio-button>
                        <el-radio-button label="居左"></el-radio-button>
                      </el-radio-group>
                </el-form-item>
                <el-form-item label="名称垂直位置：">
                    <el-radio-group v-model="pointData.verticalOrigin" size="mini" @change="modifyEntityPoint">
                        <el-radio-button label="居中"></el-radio-button>
                        <el-radio-button label="居上"></el-radio-button>
                        <el-radio-button label="居下"></el-radio-button>
                      </el-radio-group>
                </el-form-item>
            </div>
            <el-form-item label="是否根据距离缩放：">
                <el-switch v-model="pointData.isScaleByDistance"  @change="modifyEntityPoint"/>
            </el-form-item>
            <div v-show="pointData.isScaleByDistance">
                <el-form-item label="上线：">
                    <el-input v-model="pointData.scaleByDistance.near" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="比例值：">
                    <el-input v-model="pointData.scaleByDistance.nearValue" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="下线：">
                    <el-input v-model="pointData.scaleByDistance.far" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="比例值：">
                    <el-input v-model="pointData.scaleByDistance.farValue" @input="modifyEntityPoint"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="是否根据距离显隐：">
                <el-switch v-model="pointData.isDistanceDisplayCondition" />
            </el-form-item>
            <div v-if="pointData.isDistanceDisplayCondition">
                <el-form-item label="最大距离：">
                    <el-input v-model="pointData.distanceDisplayCondition.near" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="最小距离：">
                    <el-input v-model="pointData.distanceDisplayCondition.far" @input="modifyEntityPoint"></el-input>
                </el-form-item>
                <el-form-item label="是否被遮挡：">
                    <el-switch v-model="pointData.isDisableDepthTestDistance"  @change="modifyEntityPoint"/>
                </el-form-item>
            </div>
            <el-form-item label="经度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.longitude" :min="-180" :max="180" :step="0.000001"
                        @input="modifyEntityPoint" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="纬度：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.latitude" :min="-90" :max="90" :step="0.00001"
                        @input="modifyEntityPoint" :precision="6"></el-input-number>
                </div>
            </el-form-item>
            <el-form-item label="高度(m)：">
                <div class="el-form-item-flex">
                    <el-input-number v-model="pointData.location.height" :min="-10000" :max="10000" :step="1"
                        @input="modifyEntityPoint" :precision="1"></el-input-number>
                </div>
            </el-form-item>

        </el-form>
        <el-button @click="addEntityPoint">新增点</el-button>
        <el-button @click="removeEntityPoint">清除点</el-button>
        <el-button @click="addPoint">新增点</el-button>
    </div>
</template>