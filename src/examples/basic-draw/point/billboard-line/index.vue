<script setup lang='ts'>
import { reactive } from 'vue'
import { loadPrimitiveDiv, flyTo, loadPrimitiveDiv2 } from "./map"

const pointData = reactive({
    name: "",
    size: 1,
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
    color: "#ff0000"
})
const infoTextData: any[] = reactive([
    {
        lon: 113.94942076704119,
        lat: 22.5548076696712,
        height: 70,
        left: 0,
        top: 0,
        name: '城市山谷花园金果街城市山谷花园金果街城市山谷花园金果街'
    },
    {
        lon: 113.9506826252645,
        lat: 22.553751403155662,
        height: 60,
        left: 0,
        top: 0,
        name: '新世界豪园二期里昂道'
    },
    {
        lon: 113.95200938142169,
        lat: 22.553235254311705,
        height: 50,
        left: 0,
        top: 0,
        name: '新世界豪园会所30号'
    },
    
])
const drillDiv = new loadPrimitiveDiv2({
    name: 'drillDiv',
    imgUrl: '/image/popbg.png',
    color:'#e1a30f',
    fontColor:'#fff',
    backgroundColor:'rgba(0,0,1)'
})
const loadPoint = () => {
    flyTo(infoTextData[0].lon, infoTextData[0].lat)
    // loadPrimitiveDiv(infoTextData)
    drillDiv.addBillboards(infoTextData)
}
const removeBillboardFun = ()=>{
    drillDiv.removeBillBoards('城市山谷花园金果街城市山谷花园金果街城市山谷花园金果街')
}
const removeBillboardAllFun = ()=>{
    drillDiv.removeAll('drillDiv')
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="loadPoint">新增点</el-button>
        <el-button @click="removeBillboardFun">移除点</el-button>
        <el-button @click="removeBillboardAllFun">移除所有</el-button>
    </div>
</template>
<style lang="scss">
</style>