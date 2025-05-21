<script setup lang="ts">
import { ref, watch } from "vue";
import { load3dtiles,spacingChange,spacingCancel } from "./map";

setTimeout(() => {
  load3dtiles();
}, 1000);
const spacing = ref(0);
const cancel = () => {
    spacingCancel(spacing.value);
}

watch(spacing, (val) => {
    spacingChange(val)
})
</script>
<template>
    <div>
        <div class="dhy_widget-main">
            <el-button type="primary" size="small" @click="cancel">取消</el-button>
            <el-form label-width="80px">
                <el-form-item label="爆炸间距">
                    <el-slider v-model="spacing" :min="0" :max="300" :step="1"></el-slider>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>