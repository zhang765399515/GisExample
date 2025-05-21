<script lang="ts" setup>
import { addPointLightSource } from './map'

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="addPointLightSource">加载点光源</el-button>
    </div>
</template>