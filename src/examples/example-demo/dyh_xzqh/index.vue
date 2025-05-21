

<template>
    <div class="dhy-demo">
        <div><el-button type="primary" @click="xzqhFun" size="small">行政区划图</el-button></div>
        <div><el-button type="primary" @click="boundaryFun" size="small">行政区划边界</el-button></div>
        <div><el-button type="primary" @click="arrowOpacityFun(0)" size="small">29个断裂带</el-button></div>
        <div> <el-button type="primary" @click="arrowOpacityFun(1)" size="small">红色断裂带</el-button></div>
        <div><el-button type="primary" @click="arrowOpacityFun(2)" size="small">蓝色断裂带</el-button></div>
        <div><el-button type="primary" @click="arrowOpacityFun(3)" size="small">黄色断裂带</el-button></div>
        <div><el-button type="primary" @click="arrowOpacityFun(4)" size="small">紫色断裂带</el-button></div>
        <div><el-button type="primary" @click="arrowOpacityFun(5)" size="small">绿色断裂带</el-button></div>
    </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { loadLayer, loadDynamicLine, loadRegions, loadLine, loadDynamicLine2 } from "./map"
import gzData from "@/assets/data/gz_area.json"
import xzqhData from "../xzqh.json"
import xzqhData2 from "../xzqh2.json"
import xzqhLineData2 from "../xzqhLine2.json"
import xzqhLineData3 from "../xzqhLine3.json"
import bjData from "../bj.json"
import bjData2 from "../bj2.json"
import dyData from "../dy.json"
import dyData2 from "../dy2.json"
import ssdyData from "../ssdy.json"
import duanlie from "../duanlie.json"
import dl1 from "../1.json"
import dl2 from "../2.json"
import dl3 from "../3.json"
import dl4 from "../4.json"
import dl5 from "../5.json"
const colorList = {
    0: "#F8FD22",
    1: "#F10017",
    2: "#17FEE5",
    3: "#F8FD22",
    4: "#E50EEB",
    5: "#23FC24",
}
const xzqhShow = ref(false);
const boundaryShow = ref(false);
const arrowOpacityAllShow = ref(false);
const arrowOpacityRedShow = ref(false);
const arrowOpacityGreenShow = ref(false);
const arrowOpacityBlueShow = ref(false);
const arrowOpacityYellowShow = ref(false);
const arrowOpacityRoseoShow = ref(false);
onMounted(() => {
    // loadLayer();
    window.viewer.camera.flyTo({
        destination: { "x": -2453319.3937718724, "y": 5470367.215756329, "z": 2431605.0080095516 },
        orientation: {
            heading: 0.05776701062545797,
            pitch: -1.1264267561193,
            roll: 6.283178456563165
        }
    })
    window.viewer.scene.globe.depthTestAgainstTerrain = false; //开启深度拾取
    xzqhFun()
    // boundaryFun();
})
const xzqhFun = () => {
    xzqhShow.value = !xzqhShow.value;
    if (xzqhShow.value) {
        xzqhData.features.forEach(e => {
            let listData = []
            const coordinates = e.geometry.coordinates[0];
            coordinates.forEach(c => {
                listData.push(c[0], c[1], 1)
            })
            loadRegions(listData)//行政区划
        })
        xzqhData2.features.forEach(e => {
            let listData = []
            const coordinates = e.geometry.coordinates[0];
            coordinates.forEach(c => {
                listData.push(c[0], c[1], 1)
            })
            loadRegions(listData)//行政区划
        })
        loadLine(xzqhLineData2)//内边框线
        loadLine(xzqhLineData3)//内边框线

    } else {
        let primitives = window.viewer.scene.primitives._primitives;
        let dataSources = window.viewer.dataSources._dataSources;
        for (let i = primitives.length - 1; i >= 0; i--) {
            if (primitives[i].name == 'xzqh') {
                window.viewer.scene.primitives.remove(primitives[i])
            }
        }
        for (let i = dataSources.length - 1; i >= 0; i--) {
            if (dataSources[i].name == 'xzqhLine') {
                window.viewer.dataSources.remove(dataSources[i])
            }
        }
    }
}
const boundaryFun = () => {
    boundaryShow.value = !boundaryShow.value;
    if (boundaryShow.value) {
        let pointData = [], pointData2 = [];
        bjData.features.forEach(e => {
            let coordinates = e.geometry.coordinates;
            pointData = [...pointData, ...coordinates]
        })

        loadDynamicLine(pointData);//外边框线
        bjData2.features.forEach(e => {
            let coordinates = e.geometry.coordinates;
            pointData2 = [...pointData2, ...coordinates]
        })

        loadDynamicLine(pointData2);//外边框线

        for (let i = 0; i < 5; i++) {//岛屿外边框线
            let dyList = [], ssdyList = [];
            dyData.features.forEach(e => {
                const coordinates = e.geometry.coordinates;
                if (e.properties["FID_外框"] == i) {
                    dyList.push(coordinates[0], coordinates[1])
                }
            })
            if (dyList.length > 0) {
                loadDynamicLine(dyList);
            }
        }

        for (let i = 1; i <= 3; i++) {//岛屿外边框线
            let dyList = [], ssdyList = [];
            dyData2.features.forEach(e => {
                const coordinates = e.geometry.coordinates;
                if (e.properties["ORIG_FID"] == i) {
                    dyList.push(coordinates[0], coordinates[1])
                }
            })
            if (dyList.length > 0) {
                loadDynamicLine(dyList);
            }
        }


    } else {
        let primitives = window.viewer.scene.primitives._primitives;
        for (let i = primitives.length - 1; i >= 0; i--) {
            if (primitives[i].name == 'boundary') {
                window.viewer.scene.primitives.remove(primitives[i])
            }
        }

    }

}

const arrowOpacityFun = (type) => {
    arrowOpacityAllShow.value = !arrowOpacityAllShow.value
    let data = null
    switch (type) {
        case 0:
            data = duanlie.features;
            break;
        case 1:
            data = dl1.features;
            break;
        case 2:
            data = dl2.features;
            break;
        case 3:
            data = dl3.features;
            break;
        case 4:
            data = dl4.features;
            break;
        case 5:
            data = dl5.features;
            break;
    }
    if (arrowOpacityAllShow.value) {
        data.forEach(e => {
            let listData = []
            let coordinates = e.geometry.coordinates;
            coordinates.forEach(c => {
                listData.push(c[0], c[1], 5)
            })
            loadDynamicLine2(listData, colorList[type], type)
        })

    } else {
        let primitives = window.viewer.scene.primitives._primitives;
        for (let i = primitives.length - 1; i >= 0; i--) {
            if (primitives[i].name == 'arrowOpacity' + type) {
                window.viewer.scene.primitives.remove(primitives[i])
            }
        }

    }
}
</script>
<style lang="scss" scoped>
.dhy-demo {
    position: fixed;
    top: 80px;
    left: 10px;
    >div{
        margin-top: 5px;
        .el-button{
            width:80px;
        }
    }
}
</style>