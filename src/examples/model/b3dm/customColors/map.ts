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
    GeoJsonDataSource
} from "geokey-gis"
import shpJson from "./line.json"
export function load3dtiles(){
  let promise = GeoJsonDataSource.load(shpJson, {
    fill: Color.PINK,
    clampToGround:true
  })
  promise.then((dataSource)=>{
    window.viewer.dataSources.add(dataSource);
})
    const tile = window.viewer.scene.primitives.add(new Geokey3DTileset({
        url:'http://14.22.86.227:12022/service/gis/3DModel/baimo/tileset.json?serviceName=sz_baimo'
    }))
    tile.readyPromise.then(til=>{
        // window.viewer.zoomTo(tile)
        window.viewer.camera.flyTo({
          destination:Cartesian3.fromDegrees(114.333572,22.713594,10000)
        })
        // til.customShader = loadCustomShader();
    })
    tile.style = new Geokey3DTileStyle({
      color: {
        conditions: [
          ['true', 'rgba(42, 85, 141 ,0.8)']
        ]
      }
    });
    tile.tileVisible.addEventListener(function (til) {
      var content = til.content;
      var featuresLength = content.featuresLength;
      for (let i = 0; i < featuresLength; i += 2) {
        let feature = content.getFeature(i)
        let model = feature.content._model
  
        if (model && model._sourcePrograms && model._rendererResources) {
          Object.keys(model._sourcePrograms).forEach(key => {
            let program = model._sourcePrograms[key]
            let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
            let v_position = "";
            if (fragmentShader.indexOf(" v_positionEC;") != -1) {
              v_position = "v_positionEC";
            } else if (fragmentShader.indexOf(" v_pos;") != -1) {
              v_position = "v_pos";
            }
            const color = `vec4(${feature.color.toString()})`;
  
            model._rendererResources.sourceShaders[program.fragmentShader] =
              `
              varying vec3 ${v_position};
              void main(void){
                vec4 position = czm_inverseModelView * vec4(${v_position},1); // 位置
                gl_FragColor = ${color}; // 颜色
                // gl_FragColor *= vec4(vec3(position.z / 50.0), 1.0); // 渐变
                // // 动态光环
                // float time = fract(czm_frameNumber / 180.0);
                // time = abs(time - 0.5) * 2.0;
                // float glowRange = 180.0; // 光环的移动范围(高度)
                // float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                // gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
              }
            `
          })
          model._shouldRegenerateShaders = true
        }
      }
    });
}

export function loadCustomShader(){
    return new CustomShader({
        uniforms: {
            u_envTexture: {
              value: new TextureUniform({
                url: "image/Textures/sky.jpg"
              }),
              type: UniformType.SAMPLER_2D
            },
            u_envTexture2: {
              value: new TextureUniform({
                url: "image/Textures/buildings-kj.jpg"
              }),
              type: UniformType.SAMPLER_2D
            },
            u_isDark: {
              value: true,
              type: UniformType.BOOL
            }
        },
        mode: CustomShaderMode.REPLACE_MATERIAL,
        lightingModel: LightingModel.UNLIT,
        fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material){
          vec3 positionEC = fsInput.attributes.positionEC;
          
          vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
          float glowRange = 100.0; // 光环的移动范围(高度)
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 颜色
          if(position.y > 5.0) {
            gl_FragColor *= vec4(vec3(position.y / 5.0), 0.8); // 渐变
          }
          // 动态光环
          float time = fract(czm_frameNumber / 360.0);
          time = abs(time - 0.5) * 3.0;
          float diff = step(0.005, abs( clamp(position.y / glowRange, 0.0, 1.0) - time));
          gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);

        }
          `,
      });
}