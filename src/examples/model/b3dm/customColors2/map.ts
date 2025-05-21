import { 
    Cartesian3, 
    Transforms, 
    Model, 
    Geokey3DTileset,
    Geokey3DTileStyle,
    Color,
    CustomShader,
    TextureUniform,
    UniformType,
    CustomShaderMode,
    LightingModel,
    ImageBasedLighting,
    knockout
} from "geokey-gis"

export function load3dtiles(){
    const tile = window.viewer.scene.primitives.add(new Geokey3DTileset({
        url:'http://14.22.86.227:12022/service/gis/3DModel/shenzhen_jianzhu/tileset.json?serviceName=sz_baimo'
    }))
    tile.readyPromise.then(til=>{
        window.viewer.zoomTo(tile)
        til.customShader = loadCustomShader();
    })
}

export function loadCustomShader(){
    return new CustomShader({
      lightingModel: LightingModel.UNLIT,
      uniforms: {
          color: {
            type: UniformType.VEC4,
            value: new Color(1.0, 0.0, 1.0, 1.0)
          },
      },
      fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
          vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置
          float _baseHeight = 50.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
          float _heightRange = 380.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
          float _glowRange = 400.0; // 光环的移动范围(高度)
  
          // 建筑基础色
          float mars_height = position.z - _baseHeight;
          float mars_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
          float mars_a12 = mars_height / _heightRange + sin(mars_a11) * 0.1;
  
          material.diffuse = color.rgb; // 颜色
          material.diffuse *= vec3(mars_a12);// 渐变
  
          // 动态光环
          float time = fract(czm_frameNumber / 360.0);
          time = abs(time - 0.5) * 2.0;
          float mars_h = clamp(mars_height / _glowRange, 0.0, 1.0);
          float mars_diff = step(0.005, abs(mars_h - time));
          material.diffuse += material.diffuse * (1.0 - mars_diff);
        } `
    });
}