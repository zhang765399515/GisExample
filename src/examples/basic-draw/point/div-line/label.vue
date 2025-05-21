<script setup lang='ts'>
const props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  id: {
    type: Number,
    default: 1
  }
})
const show = true
const textBtn=()=>{
  console.log(11111,props.id)
}
</script>

<template>
  <div v-if="show" :labelId="id" class="div-label-container" @click="textBtn(id)">
    <div class="animate-maker-border">
      <span class="animate-marker__text">{{ title }}</span>
    </div>
    <div class="media-style">
      <div class="media-style-circular"></div>
      <div class="media-style-Diagonal"></div>
      <div class="media-style-Horizontal"></div>
    </div>
  </div>
</template>

<style lang="scss">
.div-label-container,
.div-label-container::before,
.div-label-container::after {
  position: absolute;
  left: 0;
  bottom: 0;
  pointer-events: auto;
  cursor: pointer;
  z-index: 999;
}
.animate-maker-border{
  margin-left: 40px;
}
.animate-marker__text {
  min-width: 75px;
  max-width: 300px;
  height: 40px;
  background-color: rgba(4, 16, 19, 1);
  color: #fff;
  display: flex;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  padding: 0 30px;
  text-align: center;
  display: -webkit-box;
  /* 使用基于 WebKit 的引擎实现多行溢出 */
  -webkit-box-orient: vertical;
  /* 设置文本布局为垂直方向 */
  overflow: hidden;
  /* 超出长度隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  -webkit-line-clamp: 1;
  /* 设置最大显示行数为2行 */
}
.media-style {
  position: relative;
  height: 40px;

  >div {
    position: absolute;
  }

  .media-style-circular {
    height: 6px;
    width: 6px;
    position: absolute;
    left: 10px;
    bottom: -5px;
    border-radius: 50%;
    border: 4px solid #e1a30f;
    background: #fff;
    z-index: 99;

  }

  .media-style-Diagonal {
    bottom: 23px;
    left: 10px;
    width: 40px;
    border-top: 2px solid #e1a30f;
    transform: rotate(-60deg);
  }


  .media-style-Horizontal {
    border-top: 2px solid #e1a30f;
    width: calc(100% - 40px);
    left: 40px;
    bottom: 40px;

  }
}
</style>