import {
  Entity,
  CallbackProperty,
  Cartesian3,
  Color,
  ColorMaterialProperty,
  CylinderGeometry,
  MaterialAppearance,
  GeometryInstance,
  Matrix4,
  Transforms,
  Material,
  Primitive
} from 'geokey-gis';

export function load(
  value = {
    longitude: 114.19,
    latitude: 23.9,
    HeightGround: 0,//离地高度
    height: 400000,//总高度
    topWidth: 10,//顶部宽度
    bottomWidth: 42000,//底部宽度
    repeat: 100.0,//分层数量
    offset: 2, //速度
    thickness: 0.5, //层高度
    fade: true, //是否需要透明
    directionBottom: true, //向下动画
  }
) {
  let cylinderGeometry = new CylinderGeometry({
    length: value.height,
    topRadius: value.topWidth,
    bottomRadius: value.bottomWidth
  });
  // 创建GeometryInstance
  let GeometryInstanceData = new GeometryInstance({
    geometry: cylinderGeometry,
    // 矩阵计算
    modelMatrix: Matrix4.multiplyByTranslation(
      Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(value.longitude, value.latitude)),
      new Cartesian3(0.0, 0.0, value.HeightGround + 204000),
      new Matrix4()
    )
  });
  window.viewer.scene.primitives.add(
    new Primitive({
      geometryInstances: [GeometryInstanceData],
      appearance: new MaterialAppearance({
        material: new Material({
          fabric: {
            type: 'Shader',
            uniforms: {
              color: new Color('#F8F8FF'),
              repeat: value.repeat,
              offset: value.offset,
              thickness: value.thickness,
              fade: value.fade,
              directionBottom: value.directionBottom
            },
            source: `
              uniform vec4 color;
              uniform float repeat;
              uniform float offset;
              uniform float thickness;
              uniform bool fade;
              uniform bool directionBottom;
              czm_material czm_getMaterial(czm_materialInput materialInput)
              {
                  czm_material material = czm_getDefaultMaterial(materialInput);
                  float sp = 2.0/repeat;
                  vec2 st = materialInput.st;
                  float dis = directionBottom?distance(vec2(0.5), st):1.0 - distance(vec2(0.5), st);
                  float time = fract(czm_frameNumber * offset / 1000.0);
                  float m = mod(dis - time, sp);
                  float a = step( m,sp*(thickness));
                  material.diffuse = color.rgb;
                  material.alpha = fade?a *  dis * 1.0 : a * color.a*  1.0;
                  return material;
              }
            `
          },
          translucent: false
        }),
        faceForward: false,
        closed: true
      })
    })
  );
  window.viewer.camera.flyTo({
    destination: {
      x: -2957293.3102027415,
      y: 6490053.06459902,
      z: 2108782.6585517144
    },
    orientation: { heading: 6.234296779095376, pitch: -0.8764556930283609, roll: 0 },
    duration: 1
  });
}
