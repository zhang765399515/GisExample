import { Graphic, Entity, GeoGraphicsLayer, Cartesian3 } from 'geokey-gis';
// import GeoGraphicsLayer from './GeoGraphicsLayer.js';

export function loadGraphics3D() {
  const layer = new GeoGraphicsLayer({
    id: 'layer1'
  });
  window.viewer.map.add(layer);

  //三维管道  切面为圆柱形
  const pipeline1 = {
    type: 'polyline', //autocasts as new Polyline()
    paths: [
      [105.143119, 36.146115],
      [105.143119, 35.146115],
      [106.143119, 35.146115]
    ]
  };
  const pipeSymbol1 = {
    type: 'line-3d', //autocasts as new LineSymbol3D()
    color: '#e46',
    shape: {
      type: 'circle',
      radius: 1000
    }
  };
  const pipeGraphic1 = new Graphic({
    symbol: pipeSymbol1,
    geometry: pipeline1
  });
  layer.add(pipeGraphic1);

  //三维管道 切面为星形
  const pipeline2 = {
    type: 'polyline', //autocasts as new Polyline()
    paths: [
      [106.343119, 36.146115],
      [106.343119, 35.146115],
      [107.343119, 35.146115]
    ]
  };
  const pipeSymbol2 = {
    type: 'line-3d', //autocasts as new LineSymbol3D()
    color: '#ffff00',
    shape: {
      // 截面样式
      type: 'star',
      arms: 2, // 星星的角的个数
      rOuter: 8000, // 两个角之间外边的长度
      rInner: 3000 // 两个角之间内边的长度
    }
  };
  const pipeGraphic2 = new Graphic({
    symbol: pipeSymbol2,
    geometry: pipeline2
  });
  layer.add(pipeGraphic2);

  //三维管道 切面为多边形
  const pipeline3 = {
    type: 'polyline', //autocasts as new Polyline()
    paths: [
      [107.543119, 36.146115],
      [107.543119, 35.146115],
      [108.543119, 35.146115]
    ]
  };
  const pipeSymbol3 = {
    type: 'line-3d', //autocasts as new LineSymbol3D()
    color: 'purple',
    shape: {
      type: 'polygon',
      rings: [
        [0, 0],
        [5000, 0],
        [5000, 5000],
        [0, 5000]
      ] // 组成矩形截面的四个顶点坐标，坐标点是相对的, 单位米
    }
  };
  const pipeGraphic3 = new Graphic({
    symbol: pipeSymbol3,
    geometry: pipeline3
  });
  layer.add(pipeGraphic3);

  // 绘制立体盒子
  const point = {
    type: 'point',
    longitude: 106,
    latitude: 36.746181
  };
  const boxSymbol = {
    type: 'box',
    dimensions: {
      length: 30000, // 长
      width: 30000, // 宽
      height: 30000 // 高
    },
    material: '#19e42d'
  };
  const boxGraphic = new Graphic({
    symbol: boxSymbol,
    geometry: point
  });
  layer.add(boxGraphic);

  //cone 圆锥
  const conePoint = {
    type: 'point',
    longitude: 107,
    latitude: 36.746181
  };
  const coneSymbol = {
    type: 'point-3d', //autocasts as new PointSymbol3D()
    style: {
      type: 'cone',
      height: 30000, // 圆锥高度
      width: 30000, // 底部宽度
      color: '#4af99d'
    }
  };
  const coneGraphic = new Graphic({
    geometry: conePoint,
    symbol: coneSymbol
  });
  layer.add(coneGraphic);

  //cylinder 圆柱
  const cylinderPoint = {
    type: 'point',
    longitude: 108,
    latitude: 36.746181,
    height: 5000
  };
  const cylinderSymbol = {
    type: 'point-3d', //autocasts as new PointSymbol3D()
    style: {
      type: 'cylinder',
      height: 30000,
      width: 30000, // 半径
      color: 'yellow',
      outline: true, //默认为false
      outlineColor: 'white',
      outlineWidth: 4
    }
  };

  const cylinderGraphic = new Graphic({
    geometry: cylinderPoint,
    symbol: cylinderSymbol
  });
  layer.add(cylinderGraphic);

  // //ellipsoid 椭球
  const ellipsoidPoint = {
    type: 'point',
    longitude: 109,
    latitude: 36.746181
  };
  const ellipsoidSymbol = {
    type: 'point-3d', //autocasts as new PointSymbol3D()
    style: {
      type: 'ellipsoid',
      radii: [30000, 20000, 30000], //球体三方向半径
      color: 'blue',
      outline: true, //默认为false
      outlineColor: 'white',
      outlineWidth: 4
    }
  };
  const ellipsoidGraphic = new Graphic({
    geometry: ellipsoidPoint,
    symbol: ellipsoidSymbol
  });
  layer.add(ellipsoidGraphic);

  const cpoint = {
    type: 'point',
    longitude: 107.161133,
    latitude: 36.746181,
    height: 30,
    classificationType: 1 // 支持类型： 0:地形、1:3DTile、2:或者在地面上
  };

  const modelSymbol = {
    type: 'web-style',
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=mx_yhd_hp7',
    // url: 'src/assets/model/gongkan.gltf',
    scale: 5,
    heading: 180,
    pitch: 0,
    roll: 0,
    asynchronous: true,
    minimumPixelSize: 150,
    maximumScale: 150
  };

  const model = new Graphic({
    geometry: cpoint,
    symbol: modelSymbol
  });

  layer.add(model);

  const modelpoint = {
    type: 'point',
    longitude: 107.161133,
    latitude: 36.746181,
    height: 3,
    classificationType: 1 // 支持类型： 0:地形、1:3DTile、2:或者在地面上
  };

  const modelSymbolwww = {
    type: 'web-style',
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=mx_yhd_hp7',
    scale: 5,
    heading: 0,
    pitch: 0,
    roll: 0
  };

  const modelGraphic = new Graphic({
    geometry: modelpoint,
    symbol: modelSymbolwww
  });
  layer.add(modelGraphic);

  window.viewer.goTo({
    center: [107.161133, 36.746181, 1000000]
  });
}
