<script setup lang="ts">
import { ref, watch } from "vue";
import { loadMainTileset, randomMatriTottle, cancelTilesetExplosion } from "./map";

const explHeight = ref(50);
const toExplosion = () => {
    randomMatriTottle(explHeight.value);
}

watch(explHeight, (curr, prev) => {
    randomMatriTottle(curr)
})
</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="loadMainTileset">加载倾斜摄影模型</el-button>
            <el-button type="primary" size="small" @click="toExplosion">开始</el-button>
            <el-button type="primary" size="small" @click="cancelTilesetExplosion">取消</el-button>
            <el-form label-width="80px">
                <el-form-item label="爆炸高度">
                    <el-slider v-model="explHeight" :min="0" :max="1000" :step="1"></el-slider>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>