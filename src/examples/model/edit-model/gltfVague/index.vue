<script setup lang="ts">
import { ref, watch } from "vue";
import { loadGltf } from "./map";

setTimeout(() => {
    loadGltf();
}, 1000);
</script>
<template>
    <div>
        
    </div>
</template>