<script setup lang='ts'>
import { reactive, onMounted} from 'vue'
import { loadDynamicLine } from "./map"

const pointData = reactive({
    name: "",
    size: 1,
    location: {
        longitude: 0,
        latitude: 0,
        height: 0
    },
    color: "#ff0000"
})
onMounted(() => { 
    setTimeout(()=>{
        loadDynamicLine();
    },1000)
})

</script>

<template>
</template>