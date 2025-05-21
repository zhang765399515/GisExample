import {
  Graphic,
  GeoGraphicsLayer,
  sectorPointUtils
} from "geokey-gis";

/**
 * Graphics - 绘制带有样式扇形
 */
export function loadSectorGraphics() {
  let layer = new GeoGraphicsLayer({
    id: 'layer4'
  });
  window.viewer.map.add(layer);

  //获取扇形的所有坐标点
  let points = sectorPointUtils({
    center: [106.123, 33.1446], //中心坐标
    radius: 100, //半径(米)
    startAngle: 105, //起始角度
    endAngle: 235, //终止角度
    pointNum: 60 //坐标点个数
  });
  //多边形
  let polygonGeo1 = {
    type: 'polygon',
    rings: points
  };
  let polygonSymbol1 = {
    type: 'simple-fill',
    color: { r: 227, g: 139, b: 79, a: 0.8 },
    outline: false, //是否显示边线，默认为false
    outlineColor: '#f2e81f'
  };
  let polygonGraphic1 = new Graphic({
    geometry: polygonGeo1,
    symbol: polygonSymbol1
  });
  layer.add(polygonGraphic1);

  window.viewer.goTo({
    center: [106.123, 33.1446, 100]
  });
}
