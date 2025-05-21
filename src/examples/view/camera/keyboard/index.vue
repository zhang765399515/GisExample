<script setup lang='ts'>
import { keyboardControl, keyCode, loadAircraftModel } from './map'

setTimeout(() => { keyboardControl() }, 100)
</script>

<template>
    <div class="dhy_widget-main">
        <el-button type="primary" @click="loadAircraftModel">加载飞行模型</el-button>
    </div>
    <div class="dhy_keys">
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyQ'] }">Q</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyW'] }">W</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyE'] }">E</el-button>
        <div class="dhy_place-holder"></div>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyA'] }">A</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyS'] }">S</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['KeyD'] }">D</el-button>
    </div>
    <div class="dhy_keys dhy_keys-lookat">
        <div class="dhy_place-holder"></div>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['ArrowUp'] }">↑</el-button>
        <div class="dhy_place-holder"></div>
        <div class="dhy_place-holder"></div>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['ArrowLeft'] }">←</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['ArrowDown'] }">↓</el-button>
        <el-button type="info" :class="{ 'dhy_button-active': keyCode['ArrowRight'] }">→</el-button>
    </div>
</template>