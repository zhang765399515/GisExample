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
export function mapColor() {
    window.viewer.shadows = false
    window.viewer.shadowMap.size = 2048
    window.viewer.shadowMap.softShadows = false
    window.viewer.shadowMap.maximumDistance = 4000

    window.viewer.scene.globe.enableLighting = true
    window.viewer.scene.fog.minimumBrightness = 0.5
    window.viewer.scene.fog.density = 2.0e-4 * 1.2
    window.viewer.scene.globe.atmosphereLightIntensity = 20
    window.viewer.scene.globe.atmosphereBrightnessShift = -0.01

    window.viewer.scene.postProcessStages.bloom.enabled = true
    window.viewer.scene.postProcessStages.bloom.uniforms.contrast = 119
    window.viewer.scene.postProcessStages.bloom.uniforms.brightness = -0.4
    window.viewer.scene.postProcessStages.bloom.uniforms.glowOnly = false
    window.viewer.scene.postProcessStages.bloom.uniforms.delta = 0.9
    window.viewer.scene.postProcessStages.bloom.uniforms.sigma = 3.78
    window.viewer.scene.postProcessStages.bloom.uniforms.stepSize = 5
    window.viewer.scene.postProcessStages.bloom.uniforms.isSelected = false

    window.viewer.scene.postProcessStages.ambientOcclusion.enabled = false
    window.viewer.scene.postProcessStages.ambientOcclusion.uniforms.intensity = 1.5
    window.viewer.scene.postProcessStages.ambientOcclusion.uniforms.bias = 0.4
    window.viewer.scene.postProcessStages.ambientOcclusion.uniforms.lengthCap = 0.45
    window.viewer.scene.postProcessStages.ambientOcclusion.uniforms.stepSize = 1.8
    window.viewer.scene.postProcessStages.ambientOcclusion.uniforms.blurStepSize = 1.0
}
export function loadGltf() {
    const L00 = new Cartesian3(1.234709620475769, 1.221461296081543, 1.273156881332397)
    const L1_1 = new Cartesian3(1.135921120643616, 1.171217799186707, 1.287644743919373)
    const L10 = new Cartesian3(1.245193719863892, 1.245591878890991, 1.282818794250488)
    const L11 = new Cartesian3(-1.106930732727051, -1.112522482872009, -1.153198838233948)
    const L2_2 = new Cartesian3(-1.086226940155029, -1.079731941223145, -1.101912498474121)
    const L2_1 = new Cartesian3(1.189834713935852, 1.185906887054443, 1.214385271072388)
    const L20 = new Cartesian3(0.01778045296669, 0.02013735473156, 0.025313569232821)
    const L21 = new Cartesian3(-1.086826920509338, -1.084611177444458, -1.111204028129578)
    const L22 = new Cartesian3(-0.05241484940052, -0.048303380608559, -0.041960217058659)
    const coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22]
   
    const origin = Cartesian3.fromDegrees(114.007267,22.532514, 10);
    const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

    const model = window.viewer.scene.primitives.add(Model.fromGltf({
        url: "model/scene/scene.gltf",
        modelMatrix: modelMatrix,
        minimumPixelSize: 128,
        scale:0.2
      }));
      model.readyPromise.then((m)=>{
        let ibl = model.imageBasedLighting;
        ibl.sphericalHarmonicCoefficients = coefficients;
        ibl.specularEnvironmentMaps = "image/Textures/ibl.ktx2";
        m.customShader = new CustomShader({
            uniforms: {
              u_texture: {
                value: new TextureUniform({
                  url: "image/Textures/buildings-colors2.png"
                }),
                type: UniformType.SAMPLER_2D
              },
              u_isDark: {
                value: true,
                type: UniformType.BOOL
              }
            },
            lightingModel: LightingModel.PBR,
            fragmentShaderText: `
                void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
                    if(u_isDark){
                        vec2 texCoord = fsInput.attributes.texCoord_0 * 0.3;
                        float times = czm_frameNumber / 120.0;
                        vec4 textureColor = texture(u_texture,vec2(fract(texCoord.s),float(texCoord.t) - times));
                        material.diffuse += textureColor.rgb * 0.8;
                    }
                }  `
          })
        // let ibl = model.imageBasedLighting;
        // console.log('name：ibl',ibl);
        // ibl.sphericalHarmonicCoefficients = coefficients;
        // ibl.specularEnvironmentMaps = "image/Textures/ibl.ktx2";
        // let viewModel = {
        //     luminanceAtZenith: ibl.luminanceAtZenith,
        //   };
        // knockout.track(viewModel);
      })
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
            void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
              vec3 positionMC = fsInput.attributes.positionMC;
              vec3 positionEC = fsInput.attributes.positionEC;
              vec3 normalEC = fsInput.attributes.normalEC;
              vec3 posToCamera = normalize(-positionEC);
              vec3 coord = normalize(vec3(czm_inverseViewRotation * reflect(posToCamera, normalEC)));
              float ambientCoefficient = 0.3;
              float diffuseCoefficient = max(0.0, dot(normalEC, czm_sunDirectionEC) * 1.0);
              if(u_isDark){
                  // dark
                  vec4 darkRefColor = texture(u_envTexture2, vec2(coord.x, (coord.z - coord.y) / 2.0));
                  material.diffuse = mix(mix(vec3(0.3), vec3(0.1,0.2,0.4),clamp(positionMC.z / 200., 0.0, 1.0)) , darkRefColor.rgb ,0.3);
                  material.diffuse *= 0.2;
                  // 注意shader中写浮点数是 一定要带小数点 否则会报错 比如0需要写成0.0 1要写成1.0
                  float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                  float _heightRange = 20.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
                  float _glowRange = 300.0; // 光环的移动范围(高度)
                  // 建筑基础色
                  float czm_height = positionMC.z - _baseHeight;
                  float czm_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                  float czm_a12 = czm_height / _heightRange + sin(czm_a11) * 0.1;

                  float times = czm_frameNumber / 60.0;
                  material.diffuse *= vec3(czm_a12);// 渐变
                  // 动态光环
                  float time = fract(czm_frameNumber / 360.0);
                  time = abs(time - 0.5) * 2.0;
                  float czm_h = clamp(czm_height / _glowRange, 0.0, 1.0);
                  float czm_diff = step(0.005, abs(czm_h - time));
                  material.diffuse += material.diffuse * (1.0 - czm_diff);
              } else {
                  // day
                  vec4 dayRefColor = texture(u_envTexture, vec2(coord.x, (coord.z - coord.y) / 3.0));
                  material.diffuse = mix(mix(vec3(0.000), vec3(0.5),clamp(positionMC.z / 300., 0.0, 1.0)) , dayRefColor.rgb ,0.3);
                  material.diffuse *= min(diffuseCoefficient + ambientCoefficient, 1.0);
              }
              material.alpha = 1.0;
          } `,
      });
}