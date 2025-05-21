import { Viewer, Ion, TileMapServiceImageryProvider, buildModuleUrl } from "geokey-gis";

/**
 * 通过Ceisum原生初始化3D地图模块
 * 需要设置PGEarth.Ion.defaultAccessToken为自己的Token
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNjFmMDE2Zi05NDhmLTRiNGItODQ5NC1mMzg4MGY1NjVkNjciLCJpZCI6MTcyMDI1LCJpYXQiOjE2OTc0Mjg1MDh9.pX42VOnj3F7aCPpI3dSBKl13ZEr2OJGDYhZK6tfU3Pg';

  const cesiumViewer = new Viewer(domRef, {
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
    scene3DOnly: true, // 仅3D渲染，节省GPU内存
  });

  (cesiumViewer.geokeyWidget.creditContainer as HTMLElement).style.display = 'none';

  return cesiumViewer;
}
