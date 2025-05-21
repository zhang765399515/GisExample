<script setup lang='ts'>
import { ref, provide } from 'vue';
import { getExampleId } from "@/utils/common";
import store from '@/store';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import Header from '@/components/Header/index.vue'
import PGEditor from '@/components/PGEditor/index.vue'
import PGEarthMap from '@/components/PGEarthMap/index.vue'

let mapInstance: any = null

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const mainPath = getExampleId();
const codeEditorStatus = ref<boolean>(store.appStore.editorOpened)

provide("getMapInstance", () => {
  return mapInstance
})

watch(
  () => store.appStore.editorOpened,
  (newVal, oldVal) => {
    codeEditorStatus.value = newVal;
  }
);
</script>

<template>
  <el-config-provider :locale="locale">
    <Header></Header>
    <div class="dhy_example-main">
      <div :class="{ 'dhy_monaco-editor-visible': codeEditorStatus }" class="dhy_monaco-editor">
        <PGEditor :main-path="mainPath" />
      </div>
      <div class="dhy_example-widget">
        <PGEarthMap :main-path="mainPath" />
      </div>
    </div>
  </el-config-provider>
</template>