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
    <div class="animate-div">
      <span class=""></span>
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
@keyframes span-animate {
  0% {
    width: 0px;
    height: 0px;
    border-color: rgba(53, 231, 251, 1);
  }

  50% {
    width: 20px;
    height: 20px;
    border-color: rgba(53, 231, 251, 1);
  }

  100% {
    width: 40px;
    height: 40px;
    border-color: rgba(53, 231, 251, 0);
  }
}
.animate-div{
  position: relative;
  background: #35e7fb;
  border-radius: 50%;
  box-shadow: 0px 0px 5px 2px #35e7fb;
  pointer-events: none;
  width: 10px;
  height: 10px;
  span{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid #35e7fb;
    animation: span-animate 0.5s linear infinite;
    &:last-child{
      animation-delay: 0.3s;
    }
  }
}

</style>