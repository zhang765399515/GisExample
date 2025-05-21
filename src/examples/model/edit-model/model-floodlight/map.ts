import { Geokey3DTileset, Geokey3DTileStyle, Color, Geokey3DTileStyle } from 'geokey-gis';
let tile: any = {}; //用于保存模型以便下面使用
export function load3dtiles() {
  tile = window.viewer.scene.primitives.add(
    new Geokey3DTileset({
      url: 'http://szugsdemo.igeokey.com:10149/models/szw/model_json/model/1-1/tileset.json'
    })
  );
  tile.readyPromise.then(res => {
    
    window.viewer.zoomTo(res);
    // 启用 Bloom 效果
    window.viewer.scene.postProcessStages.bloom.enabled = true;

    window.viewer.scene.postProcessStages.bloom.uniforms.glowOnly = false; // 是否只显示泛光部分
    window.viewer.scene.postProcessStages.bloom.uniforms.contrast = 128; // 对比度
    window.viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.3; // 亮度
    window.viewer.scene.postProcessStages.bloom.uniforms.delta = 1.0; // 泛光扩散范围
    window.viewer.scene.postProcessStages.bloom.uniforms.sigma = 2.0; // 模糊系数
    window.viewer.scene.postProcessStages.bloom.uniforms.stepSize = 1.0; // 步长
    
    res.style = new Geokey3DTileStyle({
        color: "color('white', 1.0)" // 高亮白色，值大于1会触发 Bloom
    });
  });
}
