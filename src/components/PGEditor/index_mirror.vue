<script setup lang='ts'>
import { defineComponent } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { ref, onMounted } from 'vue';

interface Props {
  mainPath?: string,
}

const props = defineProps<Props>() 
console.log('props: ', props);
const codeEditor = ref();

const code = ref(`console.log('Hello, world!')`)
const extensions = [javascript(), oneDark]

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload: any) => {
  view.value = payload.view
}

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state
  const ranges = state.selection.ranges
  const selected = ranges.reduce((r: any, range: any) => r + range.to - range.from, 0)
  const cursor = ranges[0].anchor
  const length = state.doc.length
  const lines = state.doc.lines
  // more state info ...
  // return ...
}

const log = console.log

onMounted(() => { })
</script>

<template>
  <div ref="codeEditor" class="dhy_code-edit">
    <codemirror v-model="code" placeholder="Code goes here..." :style="{ height: '400px' }" :autofocus="true"
      :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" @change="log('change', $event)"
      @focus="log('focus', $event)" @blur="log('blur', $event)" />
  </div>
</template>