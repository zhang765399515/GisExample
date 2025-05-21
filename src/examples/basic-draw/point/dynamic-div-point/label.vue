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

.animate-maker-border, .animate-maker-border::before, .animate-maker-border::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.animate-maker-border {
  width: 150px;
  height: 30px;
  margin: 0;
  color: #35e7fb;
  box-shadow: inset 0 0 0 1px rgba(53, 231, 251, 0.5);
 
}
.animate-maker-border::before,.animate-maker-border::after{
  content: '';
  z-index: 10;
  margin: -5%;
  box-shadow: inset 0 0 0 2px;
  animation: clipMe 8s linear infinite;
}
.animate-maker-border::before {
  animation-delay: -4s;
}
@keyframes clipMe {
 0%, 100% {
          clip: rect(0px, 170.0px, 2px, 0px);
        }
        25% {
          clip: rect(0px, 2px, 47.0px, 0px);
        }
        50% {
          clip: rect(45.0px, 170.0px, 47.0px, 0px);
        }
        75% {
          clip: rect(0px, 170.0px, 47.0px, 45.0px);
        }
} 
.animate-marker__text {
  min-width: 75px;
  max-width: 300px;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  user-select: none;
  cursor: pointer;
  background: rgba(53, 231, 251, 0.32);
  color: #35e7fb;
  display: flex;
  line-height: 30px;
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