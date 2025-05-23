import {
  Color,
  Cartesian3,
  CMath,
  ImageMaterialProperty,
  Transforms,
  Matrix3,
  Matrix4,
  Ellipsoid,
  GeokeyTerrainProvider
} from 'geokey-gis';
export async function loadTer() {
  const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
    requestVertexNormals: true,
    requestWaterMask: true
  });

  window.viewer.terrainProvider = elevationLayer;
}
export function load(val: { centerPoint: any; text?: string | undefined; fontSize?: number | undefined; style: any; }) {
  let { centerPoint, text = '默认文字', fontSize = 16, style } = val;
  if (typeof text != 'string') {
    console.log('文字必须是string类型');
    return;
  }
  console.log(centerPoint, val)
  if (!(centerPoint && centerPoint.longitude && centerPoint.longitude)) {
    console.log('经纬度数据异常');
    return;
  }
  let colorArray = [
    // "#ffffff",
    '#FF0000',
    '#FF8C00',
    '#FFFF00',
    '#008000'
  ];
  let point = [];
  let position = Cartesian3.fromDegrees(centerPoint.longitude, centerPoint.latitude);
  point.push(
    ByDirectionAndLen(position, 0, fontSize),
    ByDirectionAndLen(position, 90, text.length * fontSize),
    ByDirectionAndLen(position, 180, fontSize),
    ByDirectionAndLen(position, 270, text.length * fontSize)
  );
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
    pointAfter[1].longitude,
    pointAfter[0].latitude,
    pointAfter[1].longitude,
    pointAfter[2].latitude,
    pointAfter[3].longitude,
    pointAfter[2].latitude,
    pointAfter[3].longitude,
    pointAfter[0].latitude
  );
  console.log(lonLatArray)
  function ByDirectionAndLen(position: Cartesian3, angle: any, len: number | undefined) {
    let matrix = Transforms.eastNorthUpToFixedFrame(position);
    let mz = Matrix3.fromRotationZ(CMath.toRadians(angle || 0));
    let rotationZ = Matrix4.fromRotationTranslation(mz);
    Matrix4.multiply(matrix, rotationZ, matrix);
    let result = Matrix4.multiplyByPoint(matrix, new Cartesian3(0, len, 0), new Cartesian3());
    return result;
  }
  window.viewer.entities.add({
    polygon: {
      hierarchy: Cartesian3.fromDegreesArray(lonLatArray),
      material: new ImageMaterialProperty({
        image: drawText(text, fontSize, style),
        transparent: true,
        color: Color.WHITE
      }),
      classificationType: 2
    }
  });
}
export function flyTo(lon: number, lat: number) {
  window.viewer.camera.flyTo({
    "destination": {
      "x": -2398227.01692151,
      "y": 5384523.024579099,
      "z": 2432113.8422221723
    },
    "orientation": {
      "heading": 0.2714760899387212,
      "pitch": -0.44730397908575537,
      "roll": 0.000018074157919656386
    },
    "duration": 1
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
