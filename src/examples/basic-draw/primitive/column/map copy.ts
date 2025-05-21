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
  VertexFormat,
  Cartesian2,
  PolylineGlowMaterialProperty,
  CallbackProperty,
  CornerType
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
          offset: 1000.0,
          cycleLength: 2000.0,
          heightRedToOrange: 200.0,
          heightOrangeToYellow: 400.0,
          heightYellowToGreen: 600.0,
          heightGreenToBlue: 800.0,
          heightBlueToRed: 1000.0
        }
      }
    }),
    vertexShaderSource: `
                attribute vec3 position3DHigh;  
                attribute vec3 position3DLow;
                attribute float batchId;
                varying vec4 v_positionEC;
 
                attribute vec4 color;
                varying vec4 v_color;
                varying vec4 colorStart;
                varying vec4 colorEnd;

                void main()
                {
                    v_color = color;
                    vec4 p = czm_computePosition(); // 获取模型相对于视点位置
                    vec4 eyePosition = czm_modelViewRelativeToEye * p; // 由模型坐标 得到视点坐标
                    v_positionEC =  czm_inverseModelView * eyePosition;   // 视点在 模型坐标系中的位置
                    gl_Position = czm_modelViewProjectionRelativeToEye * p;  // 视点坐标转为屏幕坐标
                }
                    `,
    fragmentShaderSource: `        
                varying vec4 v_positionEC;
                varying vec4 v_color;
                // uniform float offset;
                // uniform float cycleLength;  
                float offset = 0.0;
                float cycleLength = 1000.0;   
                // uniform float heightRedToOrange;
                // uniform float heightOrangeToYellow;
                // uniform float heightYellowToGreen;
                // uniform float heightGreenToBlue;
                // uniform float heightBlueToRed; 

                void main() {
                  

                  float l = length(v_positionEC.xyz);

                  float alpha = fract((l - offset) / cycleLength);

                  vec3 colorRed = vec3(1.0, 0.0, 0.0);     // 红色
                  vec3 colorOrange = vec3(1.0, 0.5, 0.0);  // 橙色
                  vec3 colorYellow = vec3(1.0, 1.0, 0.0);  // 黄色
                  vec3 colorGreen = vec3(0.0, 1.0, 0.0);   // 绿色
                  vec3 colorBlue = vec3(0.0, 0.0, 1.0);    // 蓝色
                  
                //   if (l < heightRedToOrange) {
                //     alpha = l / heightRedToOrange;
                //     gl_FragColor = vec4(mix(colorRed, colorOrange, alpha), 1.0);
                // } else if (l < heightOrangeToYellow) {
                //     alpha = (l - heightRedToOrange) / (heightOrangeToYellow - heightRedToOrange);
                //     gl_FragColor = vec4(mix(colorOrange, colorYellow, alpha), 1.0);
                // } else if (l < heightYellowToGreen) {
                //     alpha = (l - heightOrangeToYellow) / (heightYellowToGreen - heightOrangeToYellow);
                //     gl_FragColor = vec4(mix(colorYellow, colorGreen, alpha), 1.0);
                // } else if (l < heightGreenToBlue) {
                //     alpha = (l - heightYellowToGreen) / (heightGreenToBlue - heightYellowToGreen);
                //     gl_FragColor = vec4(mix(colorGreen, colorBlue, alpha), 1.0);
                // } else if (l < heightBlueToRed) {
                //     alpha = (l - heightGreenToBlue) / (heightBlueToRed - heightGreenToBlue);
                //     gl_FragColor = vec4(mix(colorBlue, colorRed, alpha), 1.0);
                // } else {
                //     // 在最高点以上使用最后一种颜色
                //     gl_FragColor = vec4(colorRed, 1.0);
                // }

                  // 根据alpha值确定颜色区间并计算插值
                  if (alpha < 0.2) {
                      // 在红色和橙色之间渐变
                      alpha *= 5.0; // 将alpha范围从0-0.2映射到0-1
                      gl_FragColor = vec4(mix(colorRed, colorOrange, alpha), 1.0);
                  } else if (alpha < 0.4) {
                      // 在橙色和黄色之间渐变
                      alpha = (alpha - 0.2) * 5.0; // 将alpha范围从0.2-0.4映射到0-1
                      gl_FragColor = vec4(mix(colorOrange, colorYellow, alpha), 1.0);
                  } else if (alpha < 0.6) {
                      // 在黄色和绿色之间渐变
                      alpha = (alpha - 0.4) * 5.0; // 将alpha范围从0.4-0.6映射到0-1
                      gl_FragColor = vec4(mix(colorYellow, colorGreen, alpha), 1.0);
                  } else if (alpha < 0.8) {
                      // 在绿色和蓝色之间渐变
                      alpha = (alpha - 0.6) * 5.0; // 将alpha范围从0.6-0.8映射到0-1
                      gl_FragColor = vec4(mix(colorGreen, colorBlue, alpha), 1.0);
                  } else {
                      // 在蓝色和红色之间渐变（完成循环）
                      alpha = (alpha - 0.8) * 5.0; // 将alpha范围从0.8-1映射到0-1
                      gl_FragColor = vec4(mix(colorBlue, colorRed, alpha), 1.0);
                  }

                  // vec3 color = mix(colorStart, colorEnd, alpha);

                  // gl_FragColor = vec4(color,1);
                }
                `,
    faceForward: true,
    closed: true
  });
  console.log('name：appearance', appearance);
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

