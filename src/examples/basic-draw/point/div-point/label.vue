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

</script>

<template>
  <div v-if="show" :labelId="id" class="divlabel-container">
    <div class="animate-maker-border">
      <span class="animate-marker__text">{{ title }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.divlabel-container,
.divlabel-container::before,
.divlabel-container::after {
  position: absolute;
  left: 0;
  bottom: 0;
  pointer-events: none;
  cursor: pointer;
}

.animate-marker__text {
  min-width: 75px;
  max-width: 300px;
  height: 40px;
  background: url('/image/popbg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #35e7fb;
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
</style>