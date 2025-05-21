<!--
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2023-12-28 15:18:18
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2023-12-29 16:11:30
 * @FilePath: \vite-pgEarth\src\examples\dynamic\analysis\graphics-cluster\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { primitivesWind } from './map'

const basemap = ref<HTMLElement>();

onMounted(() => {
    setTimeout(() => {
        primitivesWind()
    }, 500)
})
</script>
<style>
.windy{
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 3;
    pointer-events: none;
}
</style>
<template></template>