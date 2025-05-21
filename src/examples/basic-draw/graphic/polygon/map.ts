import { Graphic, GeoGraphicsLayer } from "geokey-gis";
/**
 * Graphics - 绘制带有样式的面
 */
export function loadPolygonGraphics() {
  const map = window.viewer.map;
  const layer = new GeoGraphicsLayer({
    id: 'layer2'
  });
  map.add(layer);

  //多边形
  const polygonGeo1 = {
    type: 'polygon',
    rings: [
      [106.0, 33.0, 10000],
      [106.0, 31.0, 10000],
      [104.0, 32.0, 10000],
      [103.0, 30.0, 10000],
      [103.0, 33.0, 10000],
      [106.0, 33.0, 10000]
    ],
    perPositionHeight: true //使用数据中的高度值
  };

  const polygonSymbol1 = {
    type: 'simple-fill',
    color: { r: 227, g: 139, b: 79, a: 0.8 },
    outline: true, //是否显示边线，默认为false
    outlineColor: '#f2e81f'
  };
  const polygonGraphic1 = new Graphic({
    geometry: polygonGeo1,
    symbol: polygonSymbol1
  });
  layer.add(polygonGraphic1);

  //多边形拉伸
  const polygonGeo2 = {
    type: 'polygon',
    rings: [
      [108.0, 33.0],
      [108.0, 31.0],
      [109.0, 31.0],
      [109.0, 33.0]
    ]
  };
  const polygonSymbol2 = {
    type: 'simple-fill',
    color: { r: 227, g: 139, b: 79, a: 0.8 },
    outline: true, //是否显示边线，默认为false
    outlineColor: 'red',
    extrudedHeight: 30000
  };
  const polygonGraphic2 = new Graphic({
    geometry: polygonGeo2,
    symbol: polygonSymbol2
  });
  layer.add(polygonGraphic2);

  //中空多边形
  // const polygonGeo3 = {
  //   type: 'polygon',
  //   rings: [
  //     [
  //       [96.0, 26.0],
  //       [82.0, 26.0],
  //       [82.0, 36.0],
  //       [96.0, 36.0]
  //     ],
  //     [
  //       [94.0, 27.0],
  //       [94.0, 35.0],
  //       [84.0, 35.0],
  //       [84.0, 27.0]
  //     ],
  //     [
  //       [92.0, 29.0],
  //       [86.0, 29.0],
  //       [86.0, 33.0],
  //       [92.0, 33.0]
  //     ],
  //     [
  //       [90.0, 30.0],
  //       [88.0, 30.0],
  //       [88.0, 32.0],
  //       [90.0, 32.0]
  //     ]
  //   ]
  // };
  // const polygonSymbol3 = {
  //   type: 'simple-fill',
  //   color: { r: 227, g: 139, b: 79, a: 0.8 },
  //   // outline: true, //是否显示边线，默认为false
  //   // outlineColor: '#f2e81f'
  // };
  // const polygonGraphic3 = new Graphic({
  //   geometry: polygonGeo3,
  //   symbol: polygonSymbol3
  // });
  // layer.add(polygonGraphic3);

  // //不规则拉伸多边形
  const polygonGeo4 = {
    type: 'polygon',
    rings: [
      [106.0, 23.0, 10000],
      [102.0, 23.0, 10000],
      [102.0, 25.0, 10000],
      [106.0, 25.0, 10000]
    ],
    perPositionHeight: true //使用数据中的高度值，坐标中含有高度即(经度，纬度，高度)，且高度值不同
  };
  const polygonSymbol4 = {
    type: 'simple-fill',
    color: { r: 47, g: 238, b: 120, a: 0.8 },
    outline: true, //是否显示边线，默认为false
    outlineColor: '#000',
    extrudedHeight: 20000
  };
  const polygonGraphic4 = new Graphic({
    geometry: polygonGeo4,
    symbol: polygonSymbol4
  });
  layer.add(polygonGraphic4);

  window.viewer.goTo({
    center: [106.1233, 33.144631, 1000000]
  });
}
