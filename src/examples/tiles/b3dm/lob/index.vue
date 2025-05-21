<script setup lang="ts">
import { loadPldMeshLayer } from "./map";

</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="loadPldMeshLayer">加载倾斜摄影模型</el-button>
        </div>
    </div>
</template>