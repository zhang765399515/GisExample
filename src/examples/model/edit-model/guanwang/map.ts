
import {
    Geokey3DTileset,
    Color,
    CustomShader,
    UniformType,
    LightingModel
} from 'geokey-gis';
// 流动效果参数
let flowParameters = {
    speed: 0.8,        // 流动速度
    isFlowing: true,   // 是否流动
    time: 0.0,         // 时间
    stripeWidth: 0.2,  // 条纹宽度
    stripeSpacing: 0.3, // 条纹间距
    flowIntensity: 1.2  // 流动强度
};
let tileset = null as Geokey3DTileset | null;
export async function load() {
    const tilesetData = await Geokey3DTileset.fromUrl('http://192.168.1.39:8123/guanwang/tileset.json');
    tileset = window.viewer.scene.primitives.add(tilesetData);

    if (tileset) {
        window.viewer.zoomTo(tileset);
        // 隐藏底图
        if (window.viewer.imageryLayers.length > 0) {
            window.viewer.imageryLayers.get(0).show = false;
        }

        // 设置自定义着色器
        tileset.customShader = createFlowCustomShader();

        // 启动流动动画
        startFlowAnimation();
    }
}
export function dynamic() {
    // 可以在这里添加动态控制逻辑
}

// 停止流动动画
export function stopFlowAnimation() {
    flowParameters.isFlowing = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

// 重新开始流动动画
export function resumeFlowAnimation() {
    flowParameters.isFlowing = true;
    startFlowAnimation();
}

// 设置流动速度
export function setFlowSpeed(speed: number) {
    flowParameters.speed = speed;
}

// 设置流动强度
export function setFlowIntensity(intensity: number) {
    flowParameters.flowIntensity = intensity;
}

// 设置条纹参数
export function setStripeParameters(width: number, spacing: number) {
    flowParameters.stripeWidth = width;
    flowParameters.stripeSpacing = spacing;
}

// 获取当前流动参数
export function getFlowParameters() {
    return { ...flowParameters };
}
// 创建流动效果的自定义着色器
const createFlowCustomShader = () => {
    return new CustomShader({
        lightingModel: LightingModel.UNLIT,
        uniforms: {
            u_color: {
                type: UniformType.VEC4,
                value: new Color(0.0, 1.0, 1.0, 0.9) // 青色流动颜色
            },
            u_speed: {
                type: UniformType.FLOAT,
                value: flowParameters.speed
            },
            u_time: {
                type: UniformType.FLOAT,
                value: flowParameters.time
            },
            u_stripeWidth: {
                type: UniformType.FLOAT,
                value: flowParameters.stripeWidth
            },
            u_stripeSpacing: {
                type: UniformType.FLOAT,
                value: flowParameters.stripeSpacing
            },
            u_flowIntensity: {
                type: UniformType.FLOAT,
                value: flowParameters.flowIntensity
            }
        },
        fragmentShaderText: `
            void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                // 获取纹理坐标，如果没有则使用位置坐标
                vec2 st = vec2(0.0);
                #ifdef HAS_TEXCOORD_0
                    st = fsInput.attributes.texCoord_0;
                #else
                    // 使用模型坐标生成UV，调整缩放比例
                    vec3 pos = fsInput.attributes.positionMC;
                    st = vec2(pos.x * 0.01, pos.y * 0.01);
                #endif

                // 确保UV坐标在合理范围内
                st = fract(st);

                // 创建流动效果 - 沿着U方向流动
                float flowOffset = u_time * u_speed;
                float flowU = fract(st.x + flowOffset);

                // 使用uniform参数创建流动条纹效果
                float stripePos = fract(flowU / u_stripeSpacing);

                // 创建主要条纹效果
                float stripe1 = smoothstep(0.0, u_stripeWidth * 0.3, stripePos) *
                               smoothstep(u_stripeWidth, u_stripeWidth * 0.7, stripePos);

                // 添加第二层条纹，创建更丰富的流动效果
                float stripe2 = smoothstep(0.4, 0.4 + u_stripeWidth * 0.2, stripePos) *
                               smoothstep(0.4 + u_stripeWidth * 0.5, 0.4 + u_stripeWidth * 0.3, stripePos);

                // 组合条纹
                float combinedStripe = max(stripe1, stripe2 * 0.5);

                // 创建沿管道方向的渐变，避免边缘突变
                float lengthGradient = smoothstep(0.0, 0.05, st.x) * smoothstep(1.0, 0.95, st.x);

                // 添加柔和的脉冲效果
                float pulse = 0.7 + 0.3 * sin(u_time * u_speed * 3.14159);

                // 定义颜色
                vec3 baseColor = vec3(0.1, 0.2, 0.35); // 管道基础颜色（深蓝色）
                vec3 flowColor = u_color.rgb;

                // 计算最终的流动强度
                float finalIntensity = combinedStripe * lengthGradient * u_flowIntensity * pulse;

                // 限制强度范围，避免过亮
                finalIntensity = clamp(finalIntensity, 0.0, 1.0);

                // 混合颜色：基础色 + 流动效果
                vec3 finalColor = mix(baseColor, flowColor, finalIntensity * 0.8);

                // 添加轻微的发光效果
                finalColor += flowColor * finalIntensity * 0.15;

                // 确保颜色在合理范围内
                finalColor = clamp(finalColor, 0.0, 1.0);

                material.diffuse = finalColor;
                material.alpha = u_color.a;
            }
        `
    });
};
// 更新着色器的时间参数
const updateShaderUniforms = () => {
    if (tileset && tileset.customShader) {
        tileset.customShader.setUniform('u_time', flowParameters.time);
        tileset.customShader.setUniform('u_speed', flowParameters.speed);
        tileset.customShader.setUniform('u_stripeWidth', flowParameters.stripeWidth);
        tileset.customShader.setUniform('u_stripeSpacing', flowParameters.stripeSpacing);
        tileset.customShader.setUniform('u_flowIntensity', flowParameters.flowIntensity);
    }
};
// 流动动画循环
let animationFrameId: number;
const startFlowAnimation = () => {
    const updateFlow = () => {
        if (flowParameters.isFlowing) {
            flowParameters.time += 0.016 * flowParameters.speed;

            // 更新着色器的时间参数
            updateShaderUniforms();
        }
        animationFrameId = requestAnimationFrame(updateFlow);
    };

    updateFlow();
};