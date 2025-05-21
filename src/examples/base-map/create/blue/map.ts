import { SceneView, ImageryLayer, UrlTemplateImageryProvider, SceneMode } from "geokey-gis";

/**
 * 初始化3D地图模块 - 蓝色地图
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  const viewer = new SceneView({
    container: domRef,
    baseLayer: new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: "http://basemap.igeokey.com:12023/basemap/gis/getArcgisMap/9/{z}/{y}/{x}"
      })
    ),
    scene3DOnly: false,
    sceneMode: SceneMode.SCENE3D
  });

  return viewer;
}
