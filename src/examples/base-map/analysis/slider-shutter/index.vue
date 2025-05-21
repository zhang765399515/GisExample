<script setup lang='ts'>
import { ref } from 'vue';
import {
    splitShutter,
    removeTiles
} from './map'
import { watch } from 'fs';

const splitVisible = ref(false);

const openSplitSlider = () => {
    if (splitVisible.value) {
        splitShutter()
    } else {
        removeTiles();
    }
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-form>
            <el-form-item label="分屏卷帘">
                <el-switch v-model="splitVisible" @change="openSplitSlider"></el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>