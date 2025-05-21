import { clone, Cartesian3, Model, Graphic, GeoGraphicsLayer } from 'geokey-gis';

/**
 * Graphics - 加载带有样式的模型
 */
export function loadModelGraphics() {
  window.viewer.goTo({
    center: [107.162133, 36.742181, 1000],
    pitch: -45
  });
  window.viewer.map.findLayerById('model-layer') && window.viewer.map.remove(window.viewer.map.findLayerById('model-layer'));
  const modelLayer = new GeoGraphicsLayer({
    id: 'model-layer'
  });
  window.viewer.map.add(modelLayer);

  const position = Cartesian3.fromDegrees(107.161133, 36.746181, 10);
  window.viewer.scene.requestRenderMode = false;
  window.viewer.entities.add({
    name: 'mx_yhd_bp6',
    position: position,
    model: {
      // uri: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=mx_yhd_bp6&uuid=1',
      // uri: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=mx_yhd_dmtx5&uuid=1',
      uri: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=luse_1&uuid=1',
      runAnimations: true,
      scale: 10,
      minimumPixelSize: 128,
      maximumScale: 150
    }
  });

  // const point = {
  //   type: 'point',
  //   longitude: 107.161133,
  //   latitude: 36.746181,
  //   height: 3,
  //   classificationType: 1 // 支持类型： 0:地形、1:3DTile、2:或者在地面上
  // };
  // const modelSymbol = {
  //   type: 'web-style',
  //   url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=mx_yhd_bp6&uuid=1',
  //   scale: 0.1,
  //   heading: 180,
  //   pitch: 0,
  //   roll: 0,
  //   asynchronous: true,
  //   minimumPixelSize: 150,
  //   maximumScale: 150
  // };
  // const modelGraphic: Graphic = new Graphic({
  //   geometry: point,
  //   symbol: modelSymbol
  // });

  // modelLayer.add(modelGraphic);
}
