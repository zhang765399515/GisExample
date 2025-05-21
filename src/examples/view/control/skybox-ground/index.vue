<script setup lang='ts'>
import { reactive } from 'vue'
import { setOneGroundSkyBox,setTwoGroundSkyBox,setThreeGroundSkyBox } from "./map"
const sky = (type)=>{
    switch (type) {
        case 1:
            setOneGroundSkyBox();
            break;
        case 2:
            setThreeGroundSkyBox();
            break;
        case 3:
            setTwoGroundSkyBox();
            break;
        default:
            break;
    }
}

</script>
<template>
    <div class="dhy_widget-main">
        <el-button @click="sky(1)">晴天</el-button>
        <el-button @click="sky(2)">蓝天</el-button>
        <el-button @click="sky(3)" >晚霞</el-button>
    </div>
</template>

<script>
</script>