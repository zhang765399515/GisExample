<script lang="ts" setup>
import { IsometricAnalysis,EqualDivisionAnalysis,init,deleteAll  } from './map'

onMounted(() => {
    init()
})
const clearFun = () => {
    deleteAll()
}
</script>

<template>
    <div class="dhy_widget-main">
        <div class="virtual-borehole">
            <div>坡度坡向：</div>
            <el-button type="primary" size="small" @click="IsometricAnalysis()">等距分析</el-button>
            <el-button type="primary" size="small" @click="EqualDivisionAnalysis()">等分分析</el-button>
            <el-button type="primary" size="small" @click="clearFun()">清除</el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .virtual-borehole{
        width: 100%;
    }
</style>