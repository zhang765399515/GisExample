import {SceneView,ImageryLayer, UrlTemplateImageryProvider, SceneMode } from "geokey-gis";

let viewer: PGEarth.SceneView;
/**
 * 初始化3D地图模块
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  viewer = new SceneView({
    container: domRef,
    baseLayer: new ImageryLayer(new UrlTemplateImageryProvider({
        url: "http://basemap.igeokey.com:12023/basemap/gis/getArcgisMap/4/{z}/{y}/{x}"
    })),
    geocoder: false, 
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    scene3DOnly: false,
    sceneMode: SceneMode.SCENE3D
  });

  return viewer;
}