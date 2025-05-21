<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { load } from './map';

onMounted(() => {
  setTimeout(() => {
    load();
    load({
      longitude: 113.19,
      latitude: 23.9,
      HeightGround: 0, //离地高度
      height: 100000, //总高度
      topWidth: 10, //顶部宽度
      bottomWidth: 42000, //底部宽度
      repeat: 40.0, //分层数量
      offset: 1, //速度
      thickness: 0.5, //层高度
      fade: false, //是否需要透明
      directionBottom: false //向下动画
    });
  }, 1000);
});
</script>

<template></template>
