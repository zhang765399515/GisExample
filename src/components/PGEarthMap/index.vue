<script setup lang='ts'>
import { ref, onMounted, provide } from 'vue';
import { initMap } from './common/index'
import operation from './operation.vue'

interface Props {
  mainPath?: string,
}

let mapInstance: any = null
const mapLoaded = ref(false) // map加载完成
const basemap = ref<HTMLElement>();
const props = defineProps<Props>()

provide("getMapInstance", () => {
  return mapInstance
})

const marsOnload = (map: any) => {
  mapInstance = map
  mapLoaded.value = true
}

function onChildMounted() {
  marsOnload(window.viewer)
}

onMounted(() => {
  initMap(props.mainPath as string, basemap.value as HTMLElement);
})
</script>

<template>
  <div id="basemap" ref="basemap" class="dhy_base-map">
    <div id="slider"></div>
  </div>
  <operation @childMounted="onChildMounted"></operation>
</template>
<style lang="scss" scoped>
  :deep(#navigationDiv){
    display: none;
  }
</style>