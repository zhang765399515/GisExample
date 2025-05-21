/*
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2024-04-12 17:40:52
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2024-04-15 16:19:43
 * @FilePath: \vite-pgEarth\src\examples\base-map\basic\depth-terrain\map.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GeokeyTerrainProvider, GeoGraphicsLayer, Cartographic, GeoPoint, SimpleMarkerSymbol, Graphic,Cartesian3 } from "geokey-gis";

export function initTerrain() {
  window.viewer.scene.requestRenderMode = false
  window.viewer.scene.globe.depthTestAgainstTerrain = true
  var provider0 = new GeokeyTerrainProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_dem'
  })
  window.viewer.terrainProvider = provider0;
}
export function addTestPoint() {
  let layer = new GeoGraphicsLayer({
    id: 'layer1',
    viewer: window.viewer
  });
  window.viewer.map.add(layer);
  // 绘制点
  const point = new GeoPoint({
    longitude: 113.965276,
    latitude: 22.718583,
    height: 0
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
    id: 'geokey',
    geometry: point,
    symbol: pointSymbol
  });
  layer.add(graphic);
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees( 113.964954, 22.702484, 1000),
    // duration: 1,
    orientation:{
      heading:6.270144622039757,
      pitch:-0.4143134557173829,
      roll:6.283134046998324
    }
});
}
export function openDepthTerrain() {
  window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启坐标深度拾取
}
export function closeDepthTerrain() {
  window.viewer.scene.globe.depthTestAgainstTerrain = false; //关闭坐标深度拾取
}