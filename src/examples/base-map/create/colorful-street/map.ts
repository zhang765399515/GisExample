import { SceneView, ImageryLayer, UrlTemplateImageryProvider, SceneMode } from "geokey-gis";
import * as GeokeyGIS from "geokey-gis";

let viewer: SceneView;
/**
 * 初始化3D地图模块
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  console.log(GeokeyGIS);
  viewer = new SceneView({
    container: domRef,
    baseLayer: new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: "http://basemap.igeokey.com:12023/basemap/gis/getArcgisMap/8/{z}/{y}/{x}"
      })
    ),
    geocoder: false, //地名查找,默认true
    homeButton: false, //主页按钮，默认true
    sceneModePicker: false, // 2D,3D和Columbus View切换控件
    baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
    navigationHelpButton: false, // 帮助提示控件
    animation: false, //视图动画播放速度控件，默认true
    timeline: false, //时间线,默认true
    fullscreenButton: false, //全屏按钮,默认显示true
    infoBox: false, //点击要素之后显示的信息,默认true
    selectionIndicator: false, //选中元素显示,默认true
    scene3DOnly: false, // 仅3D渲染，节省GPU内存
    sceneMode: SceneMode.SCENE3D
  });

  return viewer;
}
