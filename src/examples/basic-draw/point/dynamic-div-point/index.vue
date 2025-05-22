<script setup lang='ts'>
import { reactive, render,createVNode } from 'vue'
import {DivLabel,removeDiv,flyTo} from "./map"

const divNodes: VNode[] = []

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
    {
        lon: 113.94996512568105,
        lat: 22.551799905123904,
        height: 55,
        left: 0,
        top: 0,
        name: '华润城润府'
    },
    {
        lon: 113.95012699853692,
        lat: 22.550435584140804,
        height: 220,
        left: 0,
        top: 0,
        name: '华润城润府三期6栋'
    },
    {
        lon: 113.95240249124103,
        lat: 22.544809116153715,
        height: 220,
        left: 0,
        top: 0,
        name: '华润置地大厦C座'
    },
    {
        lon: 113.95005865416705,
        lat: 22.544203210432997,
        height: 200,
        left: 0,
        top: 0,
        name: '华润置地大厦7栋A座'
    },
    {
        lon: 113.9479777228776,
        lat: 22.54415266126018,
        height: 135,
        left: 0,
        top: 0,
        name: '大冲商务中心'
    },
    {
        lon: 113.94535544754056,
        lat: 22.54493613573294,
        height: 135,
        left: 0,
        top: 0,
        name: '2栋2A'
    },
    {
        lon: 113.94238434358512,
        lat: 22.54407462387136,
        height: 45,
        left: 0,
        top: 0,
        name: '长城科技大厦'
    },
    {
        lon: 113.94000390674175,
        lat: 22.540830112015332,
        height: 300,
        left: 0,
        top: 0,
        name: '中国储能大厦'
    },
    {
        lon: 113.93724613894094,
        lat: 22.53699374928214,
        height: 30,
        left: 0,
        top: 0,
        name: '高新工业村'
    },
    {
        lon: 113.93734839838784,
        lat: 22.533935097545328,
        height: 75,
        left: 0,
        top: 0,
        name: '春笛夏筝'
    },
    {
        lon: 113.93610046221771,
        lat: 22.527521944534165,
        height: 90,
        left: 0,
        top: 0,
        name: '软件产业基地1栋'
    },
    {
        lon: 113.93425304180607,
        lat: 22.526247904005764,
        height: 50,
        left: 0,
        top: 0,
        name: '软件产业基地5栋'
    },
    {
        lon: 113.93016661962929,
        lat: 22.526174447429838,
        height: 200,
        left: 0,
        top: 0,
        name: '腾讯滨海大厦'
    },
    {
        lon: 113.94020583017401,
        lat: 22.533360330817946,
        height: 20,
        left: 0,
        top: 0,
        name: '武汉大学深圳产学研'
    },
    {
        lon: 113.9259726207993,
        lat: 22.53132065515525,
        height: 30,
        left: 0,
        top: 0,
        name: '新西南餐厅'
    },
    {
        lon: 113.92824284286081,
        lat: 22.535011206187228,
        height: 30,
        left: 0,
        top: 0,
        name: '光电子学研究所'
    },
    {
        lon: 113.92915403340781,
        lat: 22.540856837570736,
        height: 30,
        left: 0,
        top: 0,
        name: '深圳大学文科楼'
    },
    {
        lon: 113.92909578396586,
        lat: 22.54364332242666,
        height: 130,
        left: 0,
        top: 0,
        name: '万利达科技大厦'
    },
    {
        lon: 113.93481007325465,
        lat: 22.54482813301389,
        height: 40,
        left: 0,
        top: 0,
        name: '中钢大厦'
    },
    {
        lon: 113.93820600489519,
        lat: 22.54796666321955,
        height: 80,
        left: 0,
        top: 0,
        name: '普联大厦'
    },
    {
        lon: 113.93576060980381,
        lat: 22.553735355650492,
        height: 42,
        left: 0,
        top: 0,
        name: '孵化基地3号楼'
    },
    {
        lon: 113.9327005773206,
        lat: 22.55360896299171,
        height: 50,
        left: 0,
        top: 0,
        name: '生物孵化器三期'
    },
    {
        lon: 113.93164650268746,
        lat: 22.53823595089635,
        height: 120,
        left: 0,
        top: 0,
        name: '科技楼'
    },
    {
        lon: 113.9304964849339,
        lat: 22.53636022916263,
        height: 50,
        left: 0,
        top: 0,
        name: '图书馆'
    },
    {
        lon: 113.94005545621937,
        lat: 22.537601825230272,
        height: 30,
        left: 0,
        top: 0,
        name: '高新工业村'
    },
    {
        lon: 113.93825034500236,
        lat: 22.550271358818563,
        height: 200,
        left: 0,
        top: 0,
        name: '科兴科学园D3栋'
    },
    {
        lon: 113.94630472157895,
        lat: 22.5509758412267,
        height: 25,
        left: 0,
        top: 0,
        name: '南山外国语学校'
    },
    {
        lon: 113.94218565058866,
        lat: 22.546701952489894,
        height: 60,
        left: 0,
        top: 0,
        name: '金融服务技术'
    },
    {
        lon: 113.9400340692384,
        lat: 22.546839211036353,
        height: 30,
        left: 0,
        top: 0,
        name: '维用大厦'
    },
    {
        lon: 113.92931768300053,
        lat: 22.55190004516918,
        height: 40,
        left: 0,
        top: 0,
        name: '天道医药园'
    },
    {
        lon: 113.94772405879299,
        lat: 22.537680088565825,
        height: 110,
        left: 0,
        top: 0,
        name: '工勘大厦'
    },
    {
        lon: 113.94752212995036,
        lat: 22.5364098012859,
        height: 110,
        left: 0,
        top: 0,
        name: '豪威科技大厦'
    },
    {
        lon: 113.94450623899729,
        lat: 22.537839586291938,
        height: 110,
        left: 0,
        top: 0,
        name: '深圳市数字技术园B2栋'
    },
    {
        lon: 113.9477954741454,
        lat: 22.540765086402967,
        height: 98,
        left: 0,
        top: 0,
        name: '赋安科技大楼'
    },
    {
        lon: 113.942043630615,
        lat: 22.539929809873072,
        height: 18,
        left: 0,
        top: 0,
        name: '中兴通迅A座'
    },
    {
        lon: 113.95037416095487,
        lat: 22.537048992503443,
        height: 41,
        left: 0,
        top: 0,
        name: '金蝶研发中心'
    },
    {
        lon: 113.95191425919471,
        lat: 22.542363382330187,
        height: 112,
        left: 0,
        top: 0,
        name: '康佳研发大厦'
    },
    {
        lon: 113.94560504003127,
        lat: 22.53300660416807,
        height: 184,
        left: 0,
        top: 0,
        name: '深圳湾科技生态园11栋'
    },
    {
        lon: 113.94339701248782,
        lat: 22.531822419834892,
        height: 27,
        left: 0,
        top: 0,
        name: '威新软件科技园5号楼'
    },
    {
        lon: 113.94808470571698,
        lat: 22.5314804745121,
        height: 49,
        left: 0,
        top: 0,
        name: '深圳湾科技生态园2栋'
    },
    {
        lon: 113.94887338662694,
        lat: 22.52819212516293,
        height: 7,
        left: 0,
        top: 0,
        name: '阳光带一期'
    },
    {
        lon: 113.94873693309815,
        lat: 22.52701313370648,
        height: 99,
        left: 0,
        top: 0,
        name: '国实大厦'
    },
    {
        lon: 113.94352456607649,
        lat: 22.526484120591718,
        height: 4,
        left: 0,
        top: 0,
        name: '南山外语学校科苑分部小学教学楼'
    },
    {
        lon: 113.93708432206117,
        lat: 22.522800497497418,
        height: 239,
        left: 0,
        top: 0,
        name: '航天科技广场B座'
    },
    {
        lon: 113.92866913708889,
        lat: 22.520667641242113,
        height: 303,
        left: 0,
        top: 0,
        name: '中洲控股金融中心'
    },
    {
        lon: 113.94418066313779,
        lat: 22.520837213834042,
        height: 41,
        left: 0,
        top: 0,
        name: '深圳湾体育中心'
    },
])


const createVnodeFun = () => {
    const node = document.getElementsByClassName('geokey-widget')[0];
    for (let i = 0; i < infoTextData.length; i++) {
        if(i == 0){
            flyTo(infoTextData[i].lon,infoTextData[i].lat)
        }
        
        const label = new DivLabel(infoTextData[i], i)
        // divNodes.push(label._vnode);
    }
    // divNodes.forEach(item => {
    //     render(item, node);
    // })
}
const removeDivFun = () =>{
    removeDiv();
}
</script>

<template>
    <div class="dhy_widget-main">
        <el-button @click="createVnodeFun">生成</el-button>
        <el-button @click="removeDivFun">移除</el-button>
    </div>
</template>