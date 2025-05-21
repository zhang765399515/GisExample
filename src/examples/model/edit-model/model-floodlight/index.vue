<template>
    <div>

    </div>
</template>

<script>
import { load3dtiles } from './map';
setTimeout(() => {
  load3dtiles();
  console.log('name：load3dtiles',load3dtiles);
},1000);
</script>