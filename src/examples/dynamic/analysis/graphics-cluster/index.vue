<!--
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2023-12-28 15:18:18
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2023-12-28 15:25:01
 * @FilePath: \vite-pgEarth\src\examples\dynamic\analysis\graphics-cluster\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang='ts'>
import {
    loadClusterLayer,
} from './map';

</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" size="small" @click="loadClusterLayer">点聚合</el-button>
    </div>
</template>