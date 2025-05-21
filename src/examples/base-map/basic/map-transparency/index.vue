<script setup lang='ts'>
import { ref, watch } from 'vue';
import { loadSurfacePierce, unloadSurfacePierce, updateExaggeration, updateSurfacePierce } from './map'

const exaggerationDegree = ref(1.0);
const isOpenSurfacePierce = ref(true);

const openSurfacePierce = () => {
    isOpenSurfacePierce.value = false
    loadSurfacePierce()
}

const closeSurfacePierce= () => {
    isOpenSurfacePierce.value = true
    unloadSurfacePierce()
}

watch(exaggerationDegree, (newV: number, oldV: number) => {
    updateSurfacePierce(newV)
})


</script>

<template>
    <!-- primitive方式绘制基础点线面圆对象 -->
    <div class="dhy_widget-main">
        <el-button size="small" @click="openSurfacePierce">开启地层透明</el-button>
        <el-button size="small" @click="closeSurfacePierce">关闭地层透明</el-button>
        <el-button size="small" @click="updateExaggeration">加载倾斜摄影</el-button>
        <el-slider :disabled="isOpenSurfacePierce" v-model="exaggerationDegree" :step="0.01" :max="1" />
    </div>
</template>