<script setup lang='ts'>
import {
    loadElevationGrandientLayer,
} from './map';

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadElevationGrandientLayer">加载等高线图层</el-button>
    </div>
</template>