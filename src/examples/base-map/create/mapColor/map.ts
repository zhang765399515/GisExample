/**
 * @todo 开启美化底图
 * @param {ImageryLayer} layer - 需要美化的图层
 * @param {Object} options - 美化参数
 * @param {number} options.gamma - 伽马值
 * @param {number} options.contrast - 对比度
 * @param {number} options.brightness - 亮度
 * @param {number} options.saturation - 饱和度
 * @param {number} options.hue - 色调
 */
import { Geokey3DTileset } from "geokey-gis"

export async function load3dtileset() {
    try {
        const tileset = await Geokey3DTileset.fromUrl(
            "http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_shenzhen_jianzhu1"
        );
        window.viewer.scene.primitives.add(tileset);
        window.viewer.zoomTo(tileset);
    } catch (error) {
        console.error(`tileset 创建失败: ${error}`);
    }
}

export function layerColor(layer, options) {
    let bloom = window.viewer.scene.postProcessStages.bloom;
    let scene = window.viewer.scene;
    // 设置伽马值
    layer.gamma = options.gamma || 1.0;

    // 设置对比度
    layer.contrast = options.contrast || 1.0;

    // 设置亮度
    layer.brightness = options.brightness || 1.0;

    // 设置饱和度
    layer.saturation = options.saturation || 1.0;

    // 设置色调
    layer.hueRotate = options.hue || 0.0;

    //设置发光
    bloom.enabled = options.enabled || false;

    //模糊
    bloom.uniforms.glowOnly = options.glow || false;

    //阴影
    window.viewer.shadows = options.shadows || false;

    //高动态范围
    scene.highDynamicRange = options.highDynamicRange || false;

}
