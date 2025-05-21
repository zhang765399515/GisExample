import {
  Cartesian3,
  Transforms,
  Color,
  MaterialAppearance,
  Primitive,
  GeometryInstance,
  BoxGeometry,
  PerInstanceColorAppearance,
  ColorGeometryInstanceAttribute,
  Material,
  VertexFormat
} from 'geokey-gis';

export function addColumn() {
  const origin = Cartesian3.fromDegrees(118.9, 29, 400);
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);
  window.viewer.camera.flyTo({
    destination: origin,
  })
  window.viewer.scene.requestRenderMode = false; // 开启实时刷新
  // 自定义顶点着色器和片源着色器
  let appearance = new MaterialAppearance({
    material: new Material({
      fabric: {
        type: 'Gradient',
        uniforms: {
          // u_cycleLength:function(){
          //     return 750.0;
          // },
        }
      }
    }),
    vertexShaderSource: `
      in vec3 position3DHigh;  
      in vec3 position3DLow;
      in float batchId;
      in vec4 color;

      out vec4 v_positionEC;
      out vec4 v_color;
      out float v_height;

      void main()
      {
          v_color = color;
          vec4 p = czm_computePosition(); // 获取模型相对于视点位置
          vec4 eyePosition = czm_modelViewRelativeToEye * p; // 由模型坐标 得到视点坐标
          v_positionEC =  czm_inverseModelView * eyePosition;   // 视点在 模型坐标系中的位置
          gl_Position = czm_modelViewProjectionRelativeToEye * p;  // 视点坐标转为屏幕坐标
          v_height = p.y;
      }`,
    fragmentShaderSource: `      
      in vec4 v_positionEC;
      in vec4 v_color;
      float u_offset = 1000.0;
      float u_cycleLength = 1500.0;
      in float v_height;

      void main() {
        float l = length(v_positionEC.xyz);
        float alpha = fract((l - u_offset) / u_cycleLength);
        vec3 colorRed = vec3(1.0, 0.0, 0.0);
        vec3 colorOrange = vec3(1.0, 0.5, 0.0);
        vec3 colorYellow = vec3(1.0, 1.0, 0.0);
        vec3 colorGreen = vec3(0.0, 1.0, 0.0);
        vec3 colorBlue = vec3(0.0, 0.0, 1.0);

        // 根据alpha值确定颜色区间并计算插值
        if (alpha < 0.2) {
            alpha *= 5.0; // 将alpha范围从0-0.2映射到0-1
            out_FragColor = vec4(mix(colorRed, colorOrange, alpha), 1.0);
        } else if (alpha < 0.4) {
            alpha = (alpha - 0.2) * 5.0;
            out_FragColor = vec4(mix(colorOrange, colorYellow, alpha), 1.0);
        } else if (alpha < 0.6) {
            alpha = (alpha - 0.4) * 5.0;
            out_FragColor = vec4(mix(colorYellow, colorGreen, alpha), 1.0);
        } else if (alpha < 0.8) {
            alpha = (alpha - 0.6) * 5.0;
            out_FragColor = vec4(mix(colorGreen, colorBlue, alpha), 1.0);
        } else {
            alpha = (alpha - 0.8) * 5.0;
            out_FragColor = vec4(mix(colorBlue, colorRed, alpha), 1.0);
        }
      }`,
    faceForward: true,
    closed: true
  });
  let primitive = window.viewer.scene.primitives.add(
    new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: BoxGeometry.fromDimensions({
          vertexFormat: VertexFormat.POSITION_AND_ST,
          dimensions: new Cartesian3(300.0, 300.0, 1000.0)
        }),
        modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(118.9, 29, 500)),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(1))
        }
      }),
      appearance: appearance
    })
  );
}
