<script setup lang='ts'>
import { ref, nextTick } from 'vue'
import {
    widgetsFlyRotation,
    closeRatation,
} from './map'

const splitVisible = ref(false);
const earthRotate = (val: boolean) => {
    if (val) {
        nextTick(() => {
            widgetsFlyRotation()
        });
    } else {
        closeRatation()
    }
}

</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-form>
            <el-form-item label="开启地球自转">
                <el-switch v-model="splitVisible" @change="earthRotate"></el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>