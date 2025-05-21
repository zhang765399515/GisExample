<script setup lang='ts'>
import {
    widgetsViewshedAnalysis,
} from './map';

const viewshed = ref(null);
const initViewshed = () => {
    widgetsViewshedAnalysis(viewshed.value)
}

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="initViewshed">可视域分析</el-button>


        <div ref="viewshed"> </div>
    </div>

</template>