import {
  Color,
  Cartesian3,
  Cartographic,
  Graphic,
  GeoGraphicsLayer,
  HorizontalOrigin,
  HeightReference,
  GeoPoint,
  GeoPolygon,
  GeoPolyline,
  PictureMarkerSymbol,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  TextSymbol,
  VerticalOrigin,
  NearFarScalar
} from 'geokey-gis';

export function loadGraphicsBasic() {
  window.viewer.scene.globe.depthTestAgainstTerrain = false;
  let layer = new GeoGraphicsLayer({
    id: 'layer1',
    viewer: window.viewer
  });
  window.viewer.map.add(layer);

  // 绘制点
  const point = new GeoPoint({
    longitude: 107.161133,
    latitude: 34.746181,
    height: 100
  } as Cartographic);
  const pointSymbol = new SimpleMarkerSymbol({
    color: { r: 255, g: 255, b: 0, a: 1 },
    size: 50,
    outline: {
      width: 10,
      color: 'red'
    }
  });
  const graphic = new Graphic({
    id: 'chaotuotuo',
    geometry: point,
    symbol: pointSymbol
  });
  layer.add(graphic);

  //图标
  const picturePoint = new GeoPoint({
    longitude: 105.161133,
    latitude: 34.746181
  } as Cartographic);
  const pictureSymbol = new PictureMarkerSymbol({
    width: 30,
    height: 30,
    url: 'image/ms.png',
    scaleByDistance: new NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0), // 设置图标比例随视野距离变化
    translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0), // 透明度随视野距离变化
    verticalOrigin: VerticalOrigin.BOTTOM, // 竖直方向的锚点位置 默认是CENTER, 还有 BASELINE，TOP
    horizontalOrigin: HorizontalOrigin.CENTER, // 竖直方向的锚点位置 默认是CENTER, 还有 BASELINE，TOP
    heightReference: HeightReference.NONE // 设置高度不相对于高程。默认为 RELATIVE_TO_GROUND（相对于高程），其他参数 CLAMP_TO_GROUND
  });
  const pictureGraphic = new Graphic({
    geometry: picturePoint,
    symbol: pictureSymbol,
    popupEnabled: true,
    popupTemplate: {
      title: '图片信息',
      content: '这是一张图片'
    }
  });
  layer.add(pictureGraphic);

  // 添加图标
  const picturePoint2 = {
    type: 'point',
    longitude: 104.161333,
    latitude: 34.76181,
    height: 100000
  };
  const pictureSymbol1 = new PictureMarkerSymbol({
    width: 30,
    height: 30,
    url: 'image/ms.png'
  });
  const pictureGraphic1 = new Graphic({
    geometry: picturePoint2,
    symbol: pictureSymbol1,
    popupEnabled: true,
    popupTemplate: {
      title: '图片信息',
      content: '这是第二张图片'
    }
  });
  layer.add(pictureGraphic1);

  // // 添加图片
  const picturePoint3 = {
    type: 'point',
    longitude: 104.161333,
    latitude: 34.66181
  };
  const pictureGraphic3 = new Graphic({
    geometry: picturePoint3,
    symbol: pictureSymbol1,
    popupEnabled: true, //默认为false
    popupTemplate: {
      title: '图片信息',
      content: '这是第二张图片'
    }
  });
  layer.add(pictureGraphic3);

  // // 普通线
  const lineGeo = new GeoPolyline({
    paths: [
      [106.1233, 35.144631, 100],
      [106.5432, 35.91006341, 300]
    ],
    perPositionHeight: true
  });
  const lineSymbol = new SimpleLineSymbol({
    width: 10,
    style: {
      color: '#00ffff'
    }
  });
  const lineGraphic = new Graphic({
    geometry: lineGeo,
    symbol: lineSymbol
  });
  //   lineGraphic.polyline.clampToGround = true // 设置线贴着高程。可以使线紧贴高程，而不是在地表以下
  layer.add(lineGraphic);

  // 多边形
  const polygonGeo1 = new GeoPolygon({
    rings: [
      [106.0, 33.0],
      [106.0, 31.0],
      [104.0, 32.0],
      [103.0, 30.0],
      [103.0, 33.0]
    ]
  });
  const polygonSymbol1 = new SimpleFillSymbol({
    color: { r: 232, g: 112, b: 0, a: 0.5 },
    // outline: true,
    // outlineColor: '#f2e81f',
    // outlineWidth: 1
  });
  const polygonGraphic1 = new Graphic({
    id: 'polygon1',
    geometry: polygonGeo1,
    symbol: polygonSymbol1
  });
  // layer.add(polygonGraphic1);

  //文字
  const textPoint = {
    type: 'point', //autocasts as new GeoPoint()
    longitude: 104.161133,
    latitude: 34.746181,
    height: 200
  };
  const textSymbol = new TextSymbol({
    color: '#fff', // 文字颜色
    text: '一段文字1', // 内容
    outlineColor: '#ccff43', // 外边线颜色
    outlineWidth: 3, // 外边线宽
    style: 'FILL_AND_OUTLINE', //默认无边线，支持的值有：OUTLINE、Fill、FILL_AND_OUTLINE
    font: {
      size: '50px', // 字体大小
      family: '宋体' // 字体
    },
    disableDepthTestDistance:500000000
  });
  const textGraphic = new Graphic({
    geometry: textPoint,
    symbol: textSymbol
  });
  layer.add(textGraphic);

  // const draw = window.viewer.entities.add({
  //   polyline: {
  //     positions: Cartesian3.fromDegreesArray([110.00354053182332, 31.022198102022568, 110.01561500610315, 31.020277685801524]),
  //     width: 5,
  //     material: Color.fromCssColorString('#ff0000'),
  //     clampToGround: false
  //   }
  // });


  window.viewer.goTo({
    center: [106.1233, 35.144631, 1000000]
  });
}
