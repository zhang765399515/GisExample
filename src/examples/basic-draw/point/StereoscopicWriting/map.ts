import {
  Color,
  Cartesian3,
  CallbackProperty,
  PolygonHierarchy,
  CMath,
  ClassificationType,
  ImageMaterialProperty,
  Entity,
  EventDriven,
  BillboardCollection,
  DistanceDisplayCondition,
  NearFarScalar,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Transforms,
  Matrix3,
  Matrix4,
  Ellipsoid,
  GeokeyTerrainProvider
} from 'geokey-gis';
export async function loadTer() {
  let provider = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem');
  window.viewer.terrainProvider = provider;
}
export function load(val: { centerPoint: any; height: any; text?: string | undefined; fontSize?: number | undefined; style?: any }) {
  let { centerPoint, height, text = '默认文字', fontSize = 16, style } = val;
  if (typeof text != 'string') {
    console.log('文字必须是string类型');
    return;
  }
  console.log(centerPoint, val);
  if (!(centerPoint && centerPoint.longitude && centerPoint.longitude)) {
    console.log('经纬度数据异常');
    return;
  }
  let point = [];
  let position = Cartesian3.fromDegrees(centerPoint.longitude, centerPoint.latitude);
  point.push(ByDirectionAndLen(position, 90, text.length * fontSize), ByDirectionAndLen(position, 270, text.length * fontSize));
  let pointAfter: { longitude: number; latitude: number }[] = [];

  point.forEach(e => {
    let cartographic = Ellipsoid.WGS84.cartesianToCartographic(e);
    let lonLat = {
      longitude: CMath.toDegrees(cartographic.longitude),
      latitude: CMath.toDegrees(cartographic.latitude)
    };
    pointAfter.push(lonLat);
  });
  let lonLatArray = [];
  lonLatArray.push(
    pointAfter[0].longitude,
    pointAfter[0].latitude,
    height + fontSize*2,
    pointAfter[0].longitude,
    pointAfter[0].latitude,
    height - fontSize*2,
    pointAfter[1].longitude,
    pointAfter[1].latitude,
    height - fontSize*2,
    pointAfter[1].longitude,
    pointAfter[1].latitude,
    height + fontSize*2
  );
  function ByDirectionAndLen(position: Cartesian3, angle: any, len: number | undefined) {
    let matrix = Transforms.eastNorthUpToFixedFrame(position);
    let mz = Matrix3.fromRotationZ(CMath.toRadians(angle || 0));
    let rotationZ = Matrix4.fromRotationTranslation(mz);
    Matrix4.multiply(matrix, rotationZ, matrix);
    let result = Matrix4.multiplyByPoint(matrix, new Cartesian3(0, len, 0), new Cartesian3());
    return result;
  }
  window.viewer.entities.add({
    wall: {
      positions: Cartesian3.fromDegreesArrayHeights(lonLatArray),
      material: new ImageMaterialProperty({
        image: drawText(text, fontSize, style),
        transparent: true,
        color: Color.WHITE
      }),
      outline: false,
      outlineWidth: 10,
      outlineColor: Color.AQUA
    }
  });
}
export function flyTo(lon: number, lat: number) {
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon, lat, 8000),
    duration: 0.5
  });
}
export function drawText(
  text = '默认文字',
  fontSize = 16,
  style = {
    colorBG: '#00FF00'
  }
) {
  var c = document.createElement('canvas');
  c.width = text.length * fontSize;
  c.height = fontSize;
  var ctx: any = c.getContext('2d');
  if (style.background) {
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.fillStyle = style.colorBG;
  ctx.textAlign = 'center';
  ctx.font = 'bold ' + fontSize + 'px 微软雅黑'; //设置字体
  ctx.textBaseline = 'hanging'; //在绘制文本时使用的当前文本基线
  ctx.fillText(text, c.width / 2, 0);
  return c;
}
