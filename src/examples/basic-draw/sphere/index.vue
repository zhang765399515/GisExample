<template>
    <div class="drill">
        <div><el-button type="primary" @click="sphereFun">加载球 </el-button></div>
    </div>

</template>

<script setup>
import { loadSphere,loadShp2 } from "./map"
    const sphereFun = () =>{
        loadSphere()
        // loadShp2()
    }
</script>

<style lang="scss" scoped>

.drill{
    position: fixed;
    top: 80px;
    left: 10px;
    >div{
        margin-top: 5px;
        .el-button{
            width:120px;
        }
    }
}
</style>