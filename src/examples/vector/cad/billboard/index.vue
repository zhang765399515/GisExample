<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { loadCADDialog } from './map';

const dialogVisible = ref<boolean>(false)

const openCADDialog = () => {
    dialogVisible.value = !dialogVisible.value;
    if (dialogVisible.value) {
        loadCADDialog()
    }
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="openCADDialog">打开CAD</el-button>
    </div>

    <div v-if="dialogVisible" class="dhy_dialog-container">
        <div class="dhy_dialog-header">
            {{ 'CAD图预览' }}
        </div>
        <div class="dhy_dialog-main">
            <canvas id="drawcad"></canvas>
        </div>
    </div>
</template>

<style lang='scss' scoped>
</style>