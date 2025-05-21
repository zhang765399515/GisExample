import {
    Cartesian3,
    ImageMaterialProperty,
    Cartesian2,
    GeometryAttributes,
    ComponentDatatype,
    GeometryAttribute,
    BoundingSphere,
    Geometry,
    PrimitiveType,
    Appearance,
    BlendingState,
} from "geokey-gis"

export function loadRectangle() {
    // 绘制多边形
    window.viewer.entities.add({
        polygon: {
            hierarchy: {
                positions: Cartesian3.fromDegreesArray([
                    120.9677706, 30.7985748,
                    110.20, 34.55,
                    120.20, 50.55
                ]),
            },
            height:0,
            extrudedHeight: 50000,
            material: new ImageMaterialProperty({
                image:"image/Textures/buildings-colors.png",
                repeat:new Cartesian2(1.0, 1.0)
            })
            // material: new StripeMaterialProperty({
            //     evenColor: Color.RED, // 偶数层的颜色
            //     oddColor: Color.BLUE, // 奇数层的颜色
            //     offset: 0, // 偏移量
            //     repeat: 2// 条纹的重复次数
            // }),
        }
    });

}
export function loadRectangle2(){
      var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, // v4-v7-v6-v5 back
      ])
      console.log('name：vertices',vertices);

      var colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, // v0-v3-v4-v5 right(green)
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, // v1-v6-v7-v2 left
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v7-v4-v3-v2 down
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, // v4-v7-v6-v5 back
      ])
      console.log('name：colors',colors);

      var attributes = new GeometryAttributes({
        position: new GeometryAttribute({
          componentDatatype: ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: vertices,
        }),
        color: new GeometryAttribute({
          componentDatatype: ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: colors,
        }),
      })

      var indices = new Uint8Array([
        // Indices of the vertices
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23, // back
      ])

      //包围球
      var boundingSphere = new BoundingSphere(
        new Cartesian3(0.0, 0.0, 0.0),
        2.0
      )

      var geometry = new Geometry({
        attributes: attributes,
        indices: indices,
        primitiveType: PrimitiveType.TRIANGLES,
        boundingSphere: boundingSphere,
      })

      let appearance = new Appearance({
        translucent: false, //显示不为半透明
        closed: true,
        renderState: {
          blending: BlendingState.PRE_MULTIPLIED_ALPHA_BLEND, //使用Alpha混合功能启用混合
          depthTest: { enabled: true }, //深度检测
          depthMask: true, //将深度值写入深度缓冲区
        },
        fragmentShaderSource: f_shader(), //片段着色器
        vertexShaderSource: v_shader(), //顶点着色器
      })

}
function v_shader() {
    return `
      attribute vec3 position3DHigh;
      attribute vec3 position3DLow;
      attribute float batchId;
      attribute vec4 color;
      varying vec4 v_color;
      void main() {
          vec4 position = czm_modelViewProjectionRelativeToEye *czm_computePosition();
          v_color = color;
          gl_Position = position;
      }`
  }
  function f_shader() {
    return `
      varying vec4 v_color;
      void main() {
          vec4 color = czm_gammaCorrect(v_color);
          gl_FragColor = color;
      }`
  }
  
