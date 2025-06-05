<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="clop">裁剪</el-button>
        <el-button type="primary" size="small" @click="cancel">取消</el-button>
    </div>
</template>

<script setup lang='ts'>
import { onMounted,reactive } from 'vue'
import { load3dtiles, clopModel,cancelModel } from './map'
    onMounted(()=>{
        setTimeout(() => {
            load3dtiles();
        }, 2000);
    })
    const clop = ()=>{
        clopModel()
    }
    const cancel = ()=>{
        cancelModel(false)
    }
</script>