<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  reflection,
  Geokey3DTileset
} from 'geokey-gis';
let Reflection:reflection;
onMounted(() => {
  setTimeout(async () => {

    let viewer = window.viewer;
    viewer.scene.sun.glowFactor = 10
    const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_shenzhen_jianzhu1&uuid=1')
    // viewer.zoomTo(tileset);
    window.viewer.goTo({
      center: [114.13219854163002, 22.601828288191225, 500],
    });
    viewer.scene.primitives.add(tileset);
    Reflection = new reflection([
      {
        longitude: 114.13219854163002,
        latitude: 22.601828288191225,
        height: 20
      },
      {
        longitude: 114.13412951977587,
        latitude: 22.600716135419976,
        height: 20
      },
      {
        longitude: 114.1333430582958,
        latitude: 22.599283208157793,
        height: 20
      },
      {
        longitude: 114.1311056105607,
        latitude: 22.59963333396336,
        height: 20
      },
    ], viewer)
    Reflection.clipAnyModel(tileset)
  }, 2000);
});
const waterData = ref({
  min_rc: 0.8,  	// 最小反射系数
  max_rc: 1.0,		// 最大反射系数
  factor: 5,			// 视线因子
  frequency: 300,
  animationSpeed: 0.01,
  amplitude: 3,
  specularIntensity: 0.8,
  baseWaterColor: 'rgba(45, 95, 146, 1.0)'
})
const modifyFun = ()=>{
  console.log('name：Reflection',waterData.value);
  Reflection&&(Reflection.changeParameters(waterData.value));
}
</script>

<template>
  <div class="dhy_widget-main">
    <el-form label-position="right" label-width="100px">
      <el-form-item label="min_rc">
        <el-slider v-model="waterData.min_rc" @input="modifyFun" :min="0" :max="2" :step="0.01"></el-slider>
      </el-form-item>
      <el-form-item label="max_rc">
        <el-slider v-model="waterData.max_rc" @input="modifyFun" :min="0" :max="2" :step="0.01"></el-slider>
      </el-form-item>
      <el-form-item label="factor">
        <el-slider v-model="waterData.factor" @input="modifyFun" :min="1" :max="100"></el-slider>
      </el-form-item>
      <el-form-item label="frequency">
        <el-slider v-model="waterData.frequency" @input="modifyFun" :min="1" :max="3000"></el-slider>
      </el-form-item>
      <el-form-item label="amplitude">
        <el-slider v-model="waterData.amplitude" @input="modifyFun" :min="1" :max="100" :step="0.1"></el-slider>
      </el-form-item>
      <el-form-item label="animationSpeed">
        <el-slider v-model="waterData.animationSpeed" @input="modifyFun" :min="0.001" :max="0.1" :step="0.001"></el-slider>
      </el-form-item>
      <el-form-item label="specularIntensity">
        <el-slider v-model="waterData.specularIntensity" @input="modifyFun" :min="0" :max="2" :step="0.01"></el-slider>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss">
.dhy_widget-main{
  width: 400px;
}
</style>
