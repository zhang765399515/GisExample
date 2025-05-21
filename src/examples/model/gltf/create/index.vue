<script setup lang="ts">
import { loadModelGraphics } from "./map";
</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <div class="dhy_widget-table">
                <el-card>
                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="dhy_widget-image">
                </el-card>
            </div>
            <el-button type="primary" size="small" @click="loadModelGraphics">加载模型</el-button>
        </div>
    </div>
</template>