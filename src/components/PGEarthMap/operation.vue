
<script lang="ts" setup>
import { defineAsyncComponent, h, ref, provide } from "vue"
import { getExampleId } from "@/utils/common"

const modules: Record<string, () => Promise<any>> = import.meta.glob("../../examples/**/index.vue")

let componentName: string | null = ""
let PannelComponent: any

provide("getCurrentWidget", () => {
  console.log(`注意：${componentName}为非widget组件，通过无法获取到currentWidget`)
  return null
})

const emits = defineEmits(["childMounted", "childUnmounted"])

const loaded = ref(false)
const exampleId = getExampleId()

if (exampleId) {
  componentName = exampleId
  modules[`../../examples/${componentName}/index.vue`] &&
    (PannelComponent = defineAsyncComponent({
      loader: modules[`../../examples/${componentName}/index.vue`],
      errorComponent: {
        render() {
          return h("")
        }
      }
    }))
  loaded.value = true
}
const onChildMounted = (e: any) => {
  emits("childMounted")
}

const onChildUnmounted = () => {
  emits("childUnmounted")
}
</script>

<template>
  <PannelComponent v-if="loaded" @vue:before-mount="onChildMounted" @vue:unmounted="onChildUnmounted" />
</template>

