<script setup lang='ts'>
import { reactive, onMounted } from 'vue'
import { DrawPolyline } from "./map"
import {
    Color,
    Cartesian3,
    CallbackProperty
} from 'geokey-gis';
let lineData = reactive({
    width: 1,
    color: "#ff0000"
})
onMounted(() => {
    setTimeout(() => {
        onePolyLine()
    }, 2000)
})
const createLabel = new DrawPolyline({});
const loadEntityLine = () => {
    createLabel.startCreate(lineData, (point) => {
        console.log('name：point', point);
    });
}
const modifyEntityLine = () => {
    createLabel.modifyPolyline(lineData);
}
const clearEntityLine = () => {
    lineData = {
        width: 1,
        color: "#ff0000"
    }
    createLabel.clear();
}
const onePolyLine = function () {
    const start = Cartesian3.fromDegrees(114.164094, 23.054028); // 起点  
    const end = Cartesian3.fromDegrees(114.140216, 22.6528421); // 终点
    // window.viewer.entities.add({
    //     polyline: {
    //         positions: [start, end],
    //         width: 5,
    //         material: Color.RED
    //     }
    // });
    // 生成5条平行线，每条间隔1000米
    var origin = Cartesian3.fromDegrees(113.77759, 22.872186); // 起点  
    var destination = Cartesian3.fromDegrees(114.561367, 22.849821); // 终点

    // 创建原始线条实体
    // var originalLine = window.viewer.entities.add({
    //     name: 'Original Line',
    //     polyline: {
    //         positions: new CallbackProperty(function () {
    //             return [origin, destination];
    //         }, false),
    //         width: 5,
    //         material: Color.RED
    //     }
    // });
    var parallelLines = createParallelLines(origin, destination, 50, 2500.0);
    var parallelLines2 = createParallelLines(start, end, 50, 1000.0);

    // 将平行线添加到Cesium Viewer中
    parallelLines.forEach(function (line) {
        window.viewer.entities.add({
            name: line.name,
            polyline: {
                positions: new CallbackProperty(function () {
                    return line.positions;
                }, false),
                width: 3,
                material: Color.fromCssColorString("#409eff"),
                clampToGround:true
            }
        });
    })
    parallelLines2.forEach(function (line) {
        window.viewer.entities.add({
            name: line.name,
            polyline: {
                positions: new CallbackProperty(function () {
                    return line.positions;
                }, false),
                width: 3,
                material: Color.fromCssColorString("#409eff"),
                clampToGround:true
            }
        });
    })
}
const createParallelLines = function (origin, destination, count, distance) {
    var positions = [];
    var direction = Cartesian3.subtract(destination, origin, new Cartesian3());
    direction = Cartesian3.normalize(direction, new Cartesian3());

    // 创建一个垂直于direction的向量（例如，在XZ平面上）
    var perpendicular = new Cartesian3(direction.y, -direction.x, 0.0);
    perpendicular = Cartesian3.normalize(perpendicular, new Cartesian3());

    // 生成平行线
    for (var i = 0; i < count; i++) {
        var offset = Cartesian3.multiplyByScalar(perpendicular, distance * (i - count / 2), new Cartesian3());
        var parallelOrigin = Cartesian3.add(origin, offset, new Cartesian3());
        var parallelDestination = Cartesian3.add(destination, offset, new Cartesian3());

        positions.push({
            name: 'Parallel Line ' + (i + 1),
            positions: [parallelOrigin, parallelDestination]
        });
    }
    return positions;
}




</script>

<template>
    <div class="dhy_widget-main">
        <!-- <el-form label-position="right" label-width="100px">
            <el-form-item label="线宽：">
                <el-slider v-model="lineData.width" @input="modifyEntityLine"></el-slider>
            </el-form-item>
            <el-form-item label="颜色：">
                <el-color-picker v-model="lineData.color" @change="modifyEntityLine"></el-color-picker>
            </el-form-item>
        </el-form>
        <el-button @click="loadEntityLine">新增</el-button>
        <el-button @click="clearEntityLine">清除</el-button> -->
    </div>
</template>