<script setup lang='ts'>
import { ref } from 'vue';
import {
    load,
    dynamic,
    stopFlowAnimation,
    resumeFlowAnimation,
    setFlowSpeed,
    setFlowIntensity,
    setStripeParameters,
    getFlowParameters
} from './map';

// 响应式参数
const isFlowing = ref(true);
const flowSpeed = ref(0.8);
const flowIntensity = ref(1.2);
const stripeWidth = ref(0.2);
const stripeSpacing = ref(0.3);

onMounted(() => {
    setTimeout(() => {
        load();
    }, 1000);
});

// 控制函数
const toggleFlow = () => {
    if (isFlowing.value) {
        stopFlowAnimation();
        isFlowing.value = false;
    } else {
        resumeFlowAnimation();
        isFlowing.value = true;
    }
};

const updateFlowSpeed = () => {
    setFlowSpeed(flowSpeed.value);
};

const updateFlowIntensity = () => {
    setFlowIntensity(flowIntensity.value);
};

const updateStripeParameters = () => {
    setStripeParameters(stripeWidth.value, stripeSpacing.value);
};
</script>

<template>
    <div class="dhy_widget-main">
        <div class="control-panel">
            <h3>管网流动效果控制</h3>

            <!-- 流动开关 -->
            <div class="control-item">
                <el-button
                    :type="isFlowing ? 'danger' : 'success'"
                    @click="toggleFlow"
                >
                    {{ isFlowing ? '停止流动' : '开始流动' }}
                </el-button>
            </div>

            <!-- 流动速度 -->
            <div class="control-item">
                <label>流动速度: {{ flowSpeed }}</label>
                <el-slider
                    v-model="flowSpeed"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    @change="updateFlowSpeed"
                />
            </div>

            <!-- 流动强度 -->
            <div class="control-item">
                <label>流动强度: {{ flowIntensity }}</label>
                <el-slider
                    v-model="flowIntensity"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                    @change="updateFlowIntensity"
                />
            </div>

            <!-- 条纹宽度 -->
            <div class="control-item">
                <label>条纹宽度: {{ stripeWidth }}</label>
                <el-slider
                    v-model="stripeWidth"
                    :min="0.05"
                    :max="0.5"
                    :step="0.05"
                    @change="updateStripeParameters"
                />
            </div>

            <!-- 条纹间距 -->
            <div class="control-item">
                <label>条纹间距: {{ stripeSpacing }}</label>
                <el-slider
                    v-model="stripeSpacing"
                    :min="0.1"
                    :max="1.0"
                    :step="0.1"
                    @change="updateStripeParameters"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.dhy_widget-main {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 8px;
    color: white;
    min-width: 300px;
}

.control-panel h3 {
    margin: 0 0 20px 0;
    color: #00ffff;
}

.control-item {
    margin-bottom: 20px;
}

.control-item label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
}

.el-slider {
    margin-top: 10px;
}
</style>