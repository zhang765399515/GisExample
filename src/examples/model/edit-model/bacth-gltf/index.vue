<script lang="ts" setup>
import { reactive } from 'vue';
import { gltfImg,gltfList,startPlanningLine } from './map';
let gltfObj = reactive({
    isSmooth: '1',
    distance: 10,
    itemNum: 10,
    direction: '1',
    directionNum: 0,
    heelType: '1',
    heelNum: 0,
    height: 0,
    scale: 1,
    transparent: 100
})
const start = () => {

}
</script>
<template>
    <div class="dhy_widget-main bacth_add_gltf">
        <div class="box-div">
            <span class="box-title">模型列表</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <img :src="item.imgUrl" v-for="(item,index) in gltfList" :key="index" :class="{'is-call': item.isCall}" @click="gltfImg(index)">
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">规划线路</span>
            <span class="box-symbol">：</span>
            <span class="box-value lonLat-precision">
                <el-button type="primary" size="mini" class="btn-bj" @click="startPlanningLine(gltfObj)">开始</el-button>
                <el-button type="info" size="mini" class="btn-bj">清除</el-button>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">线段平滑</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-radio-group v-model="gltfObj.isSmooth">
                    <el-radio label="1">否</el-radio>
                    <el-radio label="2">是</el-radio>
                </el-radio-group>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">延伸距离(m)</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-input-number type="number" v-model="gltfObj.distance" :min="0" :max="100" :step="1" :precision="1"></el-input-number>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">单体化个数</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-input-number type="number" v-model="gltfObj.itemNum" :min="0" :max="1000" :step="1"></el-input-number>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">方向</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-radio-group v-model="gltfObj.direction">
                    <el-radio label="1">随机</el-radio>
                    <el-radio label="2">统一</el-radio>
                </el-radio-group>
            </span>
        </div>
        <div class="box-div" v-if="gltfObj.direction == '2'">
            <span class="box-title">方向值</span>
            <span class="box-symbol">：</span>
            <span class="box-value box-value-transparent">
                <el-slider :show-tooltip="false" :max="360" :min="0" v-model="gltfObj.directionNum"></el-slider>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">跟线模式</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-radio-group v-model="gltfObj.heelType">
                    <el-radio label="1">随机</el-radio>
                    <el-radio label="2">统一</el-radio>
                </el-radio-group>
            </span>
        </div>
        <div class="box-div" v-if="gltfObj.heelType == '2'">
            <span class="box-title">离线距离(m)</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-input-number type="number" :min="0" :max="gltfObj.distance / 2" :step="1" :precision="1" v-model="gltfObj.heelNum"></el-input-number>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">高度(m)</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-input-number type="number" v-model="gltfObj.height" :min="-10000" :max="10000" :step="1" :precision="1"></el-input-number>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">模型大小</span>
            <span class="box-symbol">：</span>
            <span class="box-value">
                <el-input-number type="number" v-model="gltfObj.scale" :min="0" :max="100" :step="1" :precision="1"></el-input-number>
            </span>
        </div>
        <div class="box-div">
            <span class="box-title">透明度</span>
            <span class="box-symbol">：</span>
            <span class="box-value box-value-transparent">
                <el-slider :show-tooltip="false" :min="0" :max="100" v-model="gltfObj.transparent"></el-slider>
            </span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bacth_add_gltf {
    display: block !important;
    width: 300px;

    .box-div {
        height: 40px;
        line-height: 40px;

        .box-title {
            font-size: 14px;
            width: 80px;
            display: inline-block;
        }
        .box-value {
            vertical-align: middle;
            img{
                width: 50px;
                height: 60px;
                margin: 0 5px 5px;
                border-radius: 10px;
                cursor: pointer;
                box-sizing: border-box;
            }
            :deep(.el-slider) {
                width: 185px;
                display: inline-table;
                margin-left: 10px;
            }
            :deep(.el-button) {
                padding: 0px 10px;
                height: 26px;
            }
            :deep(.el-input) {
                width: 195px;
            }

            :deep(.el-radio__input.is-checked+.el-radio__label) {
                color: #fff;
            }

            :deep(.el-radio) {
                color: #fff;
                font-size: 12px;
            }
            :deep(.el-input-number) {
                width: 195px;
            }

            :deep(.el-input--medium),
            :deep(.el-input-number--medium) {
                line-height: 25px;
                width: 185px;

                .el-input {
                    width: 195px;
                    text-align: center;
                    padding: 0;
                }

                .el-input__decrease,
                .el-input__increase {
                    width: 25px;
                }

                input {
                    height: 26px;
                    line-height: 25px;
                    border: none !important;
                    text-align: center;
                    padding: 0 18px;
                    width: 185px;
                }
            }

            :deep(.el-input-number--medium) {

                .el-input-number__decrease,
                .el-input-number__increase {
                    line-height: 24px;
                    width: 25px;
                }
            }
        }
    }
    .box-div:nth-child(1){
        height: 185px;
        .box-value{
            display: block;
        }
    }
    .is-call{
        border: 1px solid #fff;
    }
}
</style>