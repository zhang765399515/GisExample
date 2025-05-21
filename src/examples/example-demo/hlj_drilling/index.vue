<template>
    <div class="drill">
        <div><el-button type="primary" @click="drillFun">加载钻孔 </el-button></div>
        <div><el-button type="primary" @click="imgFun(1)">贴图切面体 </el-button></div>
        <div><el-button type="primary" @click="imgFun(2)">渐变切面体 </el-button></div>
        <div><el-button type="primary" @click="connectDrillFun">任意剖切 </el-button></div>
        <div><el-button type="primary" @click="waterFun">水位面 </el-button></div>
        <div><el-button type="primary" @click="rodFun">标尺 </el-button></div>
        <div><el-button type="primary" @click="remove('drillPictures')">移除切面 </el-button></div>
        <div><el-button type="primary" @click="remove('waterPolygon')">移除水位面 </el-button></div>
        <div><el-button type="primary" @click="removeRodFun">移除标尺 </el-button></div>
    </div>
</template>

<script setup>
import {
    loadDrill,
    load3dtiles,
    createLine,
    drawOnePolygon,
    removePolygon,
    loadPolygon,
    distancePoint,
    drawPolygon,
    drawRod,
    removeRod,
    extendedLine,
    addPolyline,
    polygonIntersection,
    pointGraphics,
    addPoint,
} from "./map"
import { Draw, Cartesian3, ClassificationType, Color, GeoJsonDataSource } from "geokey-gis"
import boundaryData from "./SHF007_boundary84.json"
import drillData from "./drill.json"
import { onMounted } from 'vue';
let draw
onMounted(() => {
    setTimeout(() => {
        // load3dtiles()
    }, 3000)
})
const drillFun = () => {
    window.viewer.scene.postProcessStages.fxaa.enabled=true;//开启抗锯齿
    loadDrill();
}
const positions = ref([])
const connectDrillFun = () => {
    pointGraphics((val) => {
        removePolygon('drillPictures')
        let range = boundaryData.features[0].geometry.rings[0];
        let otherPolygon = [];
        val.forEach(e => {
            otherPolygon.push([e[0], e[1]]);
        })
        let line1 = extendedLine(otherPolygon[1], otherPolygon[0])//获取到第一条线延长点
        let line2 = extendedLine(otherPolygon[otherPolygon.length - 2], otherPolygon[otherPolygon.length - 1])//获取到最后一条线延长点
        if (val.length == 2) {
            otherPolygon.unshift(line1)
            otherPolygon.push(line2)
            otherPolygon.push([otherPolygon[otherPolygon.length - 1][0],otherPolygon[0][1]])
        }else{
            otherPolygon[0] = line1;
            otherPolygon[otherPolygon.length - 1] = line2;
        }
        otherPolygon.push(otherPolygon[0]);//闭环
        range.push(range[0]);//闭环
        let intersection = polygonIntersection(range, otherPolygon);
        let sectionPolygon = intersection[1].geometry.coordinates[0];
        // addPoint("point11",Cartesian3.fromDegrees(sectionPolygon[0][0],sectionPolygon[0][1],250),"#f00")
        // addPoint("point11",Cartesian3.fromDegrees(sectionPolygon[1][0],sectionPolygon[1][1],250),"#f00")
        // addPolyline(Cartesian3.fromDegreesArray(range.flat()),"#f00")
        // addPolyline(Cartesian3.fromDegreesArray(otherPolygon.flat()),"#ff0")
        // addPolyline(Cartesian3.fromDegreesArray(sectionPolygon.flat()),"#f0f")
       
        drawOnePolygon(1, sectionPolygon)

    })
}
const imgFun = (type) => {
    removePolygon('drillPictures')
    let range = boundaryData.features[0].geometry.rings[0];
    drawOnePolygon(type, range);
}
const waterFun = () => {
    // const waterData = ref([]);
    // const waterCartesian3Data = ref([]);
    // positions.value.forEach(e=>{
    //     waterCartesian3Data.value.push(Cartesian3.fromDegrees(e.lng,e.lat,0)) 
    //     waterData.value.push([e.lng,e.lat]) 
    // })
    // const distancePointData = distancePoint(waterData.value,waterCartesian3Data.value,1.5);
    // loadPolygon(distancePointData)
    let range = boundaryData.features[0].geometry.rings[0];
    let data = []
    range.forEach(e => {
        data.push(e[0], e[1], 0)
    })
    loadPolygon('waterPolygon', data, -200, "rgba(0,0,255,0.4)")
}
const remove = (name) => {
    removePolygon(name);
}
const rodFun = () => {
    let range = boundaryData.features[0].geometry.rings[0];
    console.log('name：range',range);
    for (const key in drillData) {
        let drill = drillData[key]
        drawRod(range[range.length - 1], drill, 15, false)
    }
}
const removeRodFun = () => {
    removeRod('rodLabel');
    removeRod('rodLine');
    removeRod("rodScale");
}
</script>

<style lang="scss" scoped>
.drill {
    position: fixed;
    top: 80px;
    left: 10px;

    >div {
        margin-top: 5px;

        .el-button {
            width: 120px;
        }
    }
}
</style>