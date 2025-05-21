<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { initPGEditor, fetchScript } from './index'

interface Props {
  mainPath?: string,
}

const props = defineProps<Props>()
const codeEditor = ref();

onMounted(() => {
  initPGEditor(codeEditor.value)
  props.mainPath && fetchScript(props.mainPath)
})
</script>

<template>
  <div ref="codeEditor" class="dhy_code-edit"></div>
</template>