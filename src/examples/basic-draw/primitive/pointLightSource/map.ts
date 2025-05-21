import {
  Cartesian3,
  Transforms,
  Color,
  MaterialAppearance,
  CustomShader,
  LightingModel,
  UniformType,
  Geokey3DTileset,
  CMath,
  Ellipsoid,
  HeadingPitchRoll,
} from 'geokey-gis';

export async function addPointLightSource() {
  // window.viewer.scene.requestRenderMode = false; // 开启实时刷新
  // 自定义顶点着色器和片源着色器
  let appearance = new MaterialAppearance({
    vertexShaderSource: `
      in vec3 position3DHigh;  
      in vec3 position3DLow;
      in float batchId;
      in vec4 v_positionEC;

      in vec4 color;
      out vec4 v_color;

      void main()
      {
          v_color = color;
          vec4 p = czm_computePosition(); // 获取模型相对于视点位置
          vec4 eyePosition = czm_modelViewRelativeToEye * p; // 由模型坐标 得到视点坐标
          v_positionEC =  czm_inverseModelView * eyePosition;   // 视点在 模型坐标系中的位置
          gl_Position = czm_modelViewProjectionRelativeToEye * p;  // 视点坐标转为屏幕坐标
      }`,
    fragmentShaderSource: `           
      in vec4 v_positionEC;
      in vec3 v_normalEC;
      in vec4 v_color;
      void main() {
        float l = sqrt(pow(v_positionEC.x,2.0) + pow(v_positionEC.y,2.0) + pow(v_positionEC.z,2.0)); // 距离模型坐标系原点的距离
        float cy3 = fract((abs(l - 1000.0))/2000.0); 
        float alpha = cy3;
        gl_FragColor = vec4(v_color.rgb,alpha);
      }`
  });
  // let primitive = window.viewer.scene.primitives.add(
  //   new Primitive({
  //     geometryInstances: new GeometryInstance({
  //       geometry: BoxGeometry.fromDimensions({
  //         vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
  //         dimensions: new Cartesian3(300.0, 300.0, 1000.0)
  //       }),
  //       modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(118.9, 29, 500)),
  //       attributes: {
  //         color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(1))
  //       }
  //     }),
  //     appearance: appearance
  //   })
  // );
  try {
    const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yantian_qxsy1_b3dm')
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
    addPointLight(tileset)
  } catch {

  }
  // lamp.readyPromise.then(tile=>{
  //   var cartesian = tile.boundingSphere.center; // 获取到模型的中心经纬度
  //   var cartographic = Cartographic.fromCartesian(cartesian);//将笛卡尔3转换为弧度
  //   var longitude = CMath.toDegrees(cartographic.longitude);//将弧度转换为经纬度
  //   var latitude = CMath.toDegrees(cartographic.latitude);
  //   var height = cartographic.height;
  //   let Matrix = generateModelMatrix({longitude:114.2379,latitude: 22.6057,height:50,heading:0,pitch:0,roll:0})
  //   tile.root.transform = Matrix;
  //   // addPointLight(tile)
  // })
  //   var modelMatrix2 = Transforms.eastNorthUpToFixedFrame(
  //     Cartesian3.fromDegrees(114.2379, 22.6057) // GLTF模型的位置
  // );
  //   let model = window.viewer.scene.primitives.add(Model.fromGltf({
  //     url : 'model/air.gltf',   
  //     scale:2,
  //     modelMatrix:modelMatrix2
  //   }));
  //   model.readyPromise.then(r=>{
  //     r.enableModelExperimental = true
  //     // addPointLight(r)
  //   })
}

export function addPointLight(tileset: Geokey3DTileset, distance = 1000) {

  // 点光源 颜色、位置

  const lightPoint = {

    color: Color.fromCssColorString('rgba(255,255,255,0.7)'),
    color1: new Color(1.0, 0.0, 0.0, 0.5),
    color2: new Color(0.0, 1.0, 0.0, 1),
    color3: new Color(0.0, 0.0, 1.0, 1),

    position1: Cartesian3.fromDegrees(114.2379, 22.6057, 100),
    position2: Cartesian3.fromDegrees(114.2399, 22.6016, 100),
    position3: Cartesian3.fromDegrees(114.2359, 22.6067, 100),

  };
  let entity = window.viewer.entities.add({

    position: lightPoint.position3,

    ellipsoid: {

      radii: new Cartesian3(2, 2, 2),

      material: Color.RED.withAlpha(0.5),

    }

  })
  const customShader = new CustomShader({
    lightingModel: LightingModel.UNLIT,
    uniforms: {
      u_distance: {
        type: UniformType.FLOAT,
        value: distance
      },
      u_cameraDirectionWC: {
        type: UniformType.VEC3,
        value: window.viewer.scene.camera.positionWC,
      },
      u_lightColor: {
        type: UniformType.VEC4,
        value: lightPoint.color,
      },
      u_lightPosition: {
        type: UniformType.VEC3,
        value: lightPoint.position3,

      },
    },
    fragmentShaderText: `
        //构造光照
        vec4 makeLight(vec4 lightColorHdr,vec3 lightPos,
          vec3 positionWC,vec3 positionEC,vec3 normalEC,czm_pbrParameters pbrParameters)
        {
          vec3 color = vec3(0.0);
          //透明度0.0全透明,1.0不透明
          float mx1 = 0.0;
          // 渲染目标到点光源的向量
          vec3 light1Dir = positionWC - lightPos;
          float distance = length(light1Dir);
          if(distance < u_distance){
            // czm_view * 世界坐标 -> 相机坐标
            vec4 l1 = czm_view * vec4(lightPos, 1.0);
            vec3 lightDirectionEC = l1.xyz - positionEC;
            mx1 = 1.0 - distance / u_distance;
            color = czm_pbrLighting( positionEC, normalEC, lightDirectionEC, lightColorHdr.xyz, pbrParameters ).xyz;
          }
          mx1 = max(color.r,max(color.g,color.b)) * pow(mx1,1.0) * 10.0;
          return vec4(lightColorHdr.rgb,mx1);
        }
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          //扩散
          // material.diffuse = vec3(0.5);
          // 世界坐标
          vec3 positionWC = fsInput.attributes.positionWC;
          // 相机坐标系下的法线向量
          vec3 normalEC = fsInput.attributes.normalEC;
          // 相机坐标
          vec3 positionEC = fsInput.attributes.positionEC;

          vec3 lightColorHdr = czm_lightColorHdr;
          vec3 lightDirectionEC = czm_lightDirectionEC;
          lightDirectionEC = (czm_view * vec4(u_cameraDirectionWC,1.0)).xyz - positionEC;

          czm_pbrParameters pbrParameters;
          pbrParameters.diffuseColor = material.diffuse;
          pbrParameters.f0 = vec3(0.5);
          pbrParameters.roughness = 1.0;
          vec4 lightColorR = makeLight(u_lightColor, u_lightPosition, positionWC, positionEC, normalEC, pbrParameters);
          vec3 finalColor = mix(material.diffuse.rgb,lightColorR.rgb,  lightColorR.a);
          material.diffuse = finalColor;
        }`,
  });
  const customShader2 = new CustomShader({
    lightingModel: LightingModel.UNLIT,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
            vec3 normalEC = fsInput.attributes.normalEC;
            vec3 normalMC = czm_inverseNormal * normalEC;
            vec3 color = material.diffuse;
            vec3 white = vec3(1.0,1.0,1.0);
            float m = dot(normalMC, vec3(0.0,0.0,1.0));
            m = pow(m,1.0);
            // material.diffuse = mix(color, white, clamp(m,0.0,1.0) * 0.5);
            material.diffuse = mix(color, white,  0.6);
        }
        `,
  });

  tileset.customShader = customShader;
}
export function generateModelMatrix(val: any) {
  let { longitude, latitude, height, heading, pitch, roll } = val;
  return Transforms.headingPitchRollToFixedFrame(
    Cartesian3.fromDegrees(longitude, latitude, height),
    new HeadingPitchRoll(
      CMath.toRadians(heading),
      CMath.toRadians(pitch),
      CMath.toRadians(roll),
    ),
    Ellipsoid.WGS84,
    Transforms.localFrameToFixedFrameGenerator("north", "west")
  );
}


