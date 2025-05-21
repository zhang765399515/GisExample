<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import store from '@/store';
import Header from '@/components/Header/index.vue'
import PGEditor from '@/components/PGEditor/index.vue'
import PGEarthMap from '@/components/PGEarthMap/index.vue'
//获取路由参数
const route = useRoute();
const mainPath = ref<string>((route.query.id as string))
const codeEditorStatus = ref<boolean>(store.appStore.editorOpened)

watch(
  () => store.appStore.editorOpened,
  (newVal, oldVal) => {
    codeEditorStatus.value = newVal;
  }
);
</script>

<template>
  <Header />
  <div class="dhy_example-main">
    <div :class="{ 'dhy_monaco-editor-visible': codeEditorStatus }" class="dhy_monaco-editor">
      <PGEditor :main-path="mainPath" />
    </div>
    <div class="dhy_example-widget">
      <PGEarthMap :main-path="mainPath" />
    </div>
  </div>
</template>