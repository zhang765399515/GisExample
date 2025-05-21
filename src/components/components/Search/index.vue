<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Search,Refresh } from "@element-plus/icons-vue"

const typeWidth = ref<number>(0);
const sectionRef = ref();

const getWidth = () => {
    let rightWidth:any = sectionRef;
    typeWidth.value = rightWidth.clientWidth;
}
onMounted(() => {
    getWidth();
})
</script>
<template>
    <div class="iSearch-content" ref="sectionRef">
        <div class="operation">
            <slot name='button'>
                <el-button :icon="Search" @click="$emit('sure')">查询</el-button>
                <el-button plain :icon="Refresh" @click="$emit('reset')">重置</el-button>
            </slot>
        </div>
        <div class="serch" :style="`margin-right:${typeWidth}px;`" v-on:keyup.13.stop="$emit('sure')">
            <slot>
            </slot>
        </div> 
    </div>
</template>
<style lang='scss' scoped>
$color-black:#606266;
$color-blue:blue;
:deep(.el-select){
  width:100%;
}
:deep(.el-date-editor){
  width:100%;
}
.iSearch-content {
  transition: max-height .5s;
  max-height: 500px;
  .serch {
    margin-right: 250px;
    height: auto;
    overflow: hidden;
    margin-bottom:8px;

    :deep(.el-form-item) {
      margin-bottom: 10px;
      float: left;
      margin-right: 10px;
      padding-left: 2px;
      padding-top: 1px;
      display: flex;
      align-items: center;

      .el-form-item__label {
        font-size: 14px;
        color: $color-black;
        font-weight: bold;
        min-width: 68px;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }

      .el-form-item__content {
        line-height: inherit;
        width: 240px;
      }
    }
  }

  :deep(.operation) {
    float: right;
    margin-right: 20px;
    position: relative;
    text-align: right;
  //   .rotate {
  //     transform: rotate(180deg);
  //     color: $color-blue;
  //     position: absolute !important;
  //     top: -16px !important;
  //   }
  //   .icon{
  //     position: absolute;
  //     top: -26px;
  //     right: 0px;
  //     }
  }
}
</style>