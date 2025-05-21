<script setup lang="ts">
import { loadRightClick } from "./map";

</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="loadRightClick">加载</el-button>
        </div>
    </div>
</template>

<style lang="scss">
.pgEarth-context-menu {
    display: flex;
    flex-wrap: wrap;
    width: 8vw;
    justify-content: center;
    padding: 0;

    .pgEarth-menu-item:first-child {
        border-radius: 6px 6px 0 0;
    }

    .pgEarth-menu-item:last-child {
        border-radius: 0 0 6px 6px;
    }

    .pgEarth-menu-item {
        width: 100%;
        list-style: none;
        padding: 3px;
        text-align: center;
        background-color: #1c668ddd;

        a {
            display: inline-block;
            width: 100%;
            height: 32px;
            line-height: 32px;
            border-radius: 6px;
            color: #fff;
            text-decoration: none;
        }

        a:hover {
            background-color: rgb(0, 183, 255);
        }
    }
}
</style>