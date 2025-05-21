<script setup lang="ts">
import { ref } from "vue";
import { addTileset, testFlatten, removeFlatten, loadGrandCanyon } from "./map";

const flattenHeight = ref(10);

const addFlattenPolygon = () => {
    testFlatten(flattenHeight.value)
}
</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <div style="display: flex; justify-content: space-around; align-items: center;">
                <div style="width: 100%;">从最高点向下压</div><el-input type="number" v-model="flattenHeight"></el-input>米
            </div>
            <div>
                <el-button type="primary" size="small" @click="addFlattenPolygon">绘制压平范围</el-button>
                <el-button type="primary" size="small" @click="removeFlatten">移除压平</el-button>
            </div>
            <div>
                <el-button type="primary" size="small" @click="addTileset">加载倾斜摄影模型</el-button>
                <el-button type="primary" size="small" @click="loadGrandCanyon">裁剪面</el-button>
            </div>
        </div>
    </div>
</template>