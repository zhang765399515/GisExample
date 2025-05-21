<script setup lang='ts'>
import { ref } from 'vue';
import { loadUnderground3D, openUnderground, toggleSurface } from './map'

const vgt = ref<number>(1);
const isOpenUnderground = ref<boolean>(true);

const toggleSurfaceChange = () => {
    toggleSurface(vgt.value);
};

const openUnder = () => {
    isOpenUnderground.value = !isOpenUnderground.value
    if(isOpenUnderground.value) {
        vgt.value = 1;
    }
    openUnderground(!isOpenUnderground.value);
}

</script>

<template>
    <div class="dhy_widget-main">
        <el-form>
            <el-form-item label="地表透明度">
                <el-slider :disabled="isOpenUnderground" @input="toggleSurfaceChange" :min="0" :max="1" :step="0.01" v-model="vgt" />
            </el-form-item>
        </el-form>

        <el-button type="primary" @click="loadUnderground3D">地下钻孔模型</el-button>
        <el-button type="primary" @click="openUnder">开启地下模式</el-button>
    </div>
</template>

<style lang='' scoped></style>