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

export function loadGltf() {
    const origin = Cartesian3.fromDegrees(114.007267,22.532514, 10);
    const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);
    const pointCloudWaveShader = loadCustomShader()
    const startTime = performance.now()
    window.viewer.camera.flyTo({
      destination:origin
    })
    setInterval(() => {
      const elapsedTimeSeconds = (performance.now() - startTime) / 1000
      pointCloudWaveShader.setUniform("u_time", elapsedTimeSeconds)
    }, 200)
    const model = window.viewer.scene.primitives.add(Model.fromGltf({
        url: "model/PointCloudWave.glb",
        modelMatrix: modelMatrix,
        minimumPixelSize: 128,
        scale:500
      }));
      model.readyPromise.then((m)=>{
        m.customShader = pointCloudWaveShader 
      })
}

export function loadCustomShader(){
    return new CustomShader({
      uniforms: {
        u_time: {
          type: UniformType.FLOAT,
          value: 0
        }
      },
      vertexShaderText: `
          void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput)
          {
            // 这个模型的x和y坐标在[0,1]的范围内 方便地加倍作为UV坐标。
            vec2 uv = vsInput.attributes.positionMC.xy;
            // 使点云在空间和时间上都变化的复杂波中波动。振幅是基于点云的原始形状(它已经是一个波浪形表面)。波是相对于模型中心计算的，因此转换从[0,1]-> [- 1,1]-> [0,1]
            float amplitude = 2.0 * vsInput.attributes.positionMC.z - 1.0;
            float wave = amplitude * sin(2.0 * czm_pi * uv.x - 2.0 * u_time) * sin(u_time);
            vsOutput.positionMC.z = 0.5 + 0.5 * wave;
            // 通过改变点的大小，使点脉冲进出
            vsOutput.pointSize = 5.0 + 5.0 * sin(u_time);
          } `,
      fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
          {
              // 把这些点做成圆形而不是方形
              float distance = length(gl_PointCoord - 0.5);
              if (distance > 0.5) {
                  discard;
              }
              // 制作一个正弦调色板，沿波的大致方向移动，但速度不同。系数是任意选择的。
              vec2 uv = fsInput.attributes.positionMC.xy;
              material.diffuse = 0.2 * fsInput.attributes.color_0.rgb;
              material.diffuse += vec3(0.2, 0.3, 0.4) + vec3(0.2, 0.3, 0.4) * sin(2.0 * czm_pi * vec3(3.0, 2.0, 1.0) * uv.x - 3.0 * u_time);
          }`
    });
}