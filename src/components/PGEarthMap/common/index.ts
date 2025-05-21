import * as GeokeyGIS from 'geokey-gis';

const parentGlobal = window.parent || window;
parentGlobal.GeokeyGIS = GeokeyGIS;

const pgModule = import.meta.glob('/src/examples/**/map.ts');

export function initMap(key: string, basemap: HTMLElement) {
  const globalInit = pgModule[`/src/examples/${key}/map.ts`];
  globalInit &&
    globalInit().then((result: any) => {
      if (result.initMap) {
        window.initMap = result.initMap;
      }

      const initMapFun = window.initMap ? window.initMap : globalInitMap;
      window.viewer = initMapFun(basemap);
      return result;
    });
}

// 地图主方法
function globalInitMap(domRef: HTMLElement, options?: any) {
  if (options) {
    return new GeokeyGIS.SceneView({ container: domRef, ...options });
  }
  return new GeokeyGIS.SceneView({
    container: domRef,
    geocoder: false, //地名查找,默认true
    homeButton: true, //主页按钮，默认true
    sceneModePicker: false, // 2D,3D和Columbus View切换控件
    baseLayerPicker: true, //地图切换控件(底图以及地形图)是否显示,默认显示true
    navigationHelpButton: false, // 帮助提示控件
    animation: false, //视图动画播放速度控件，默认true
    timeline: true, //时间线,默认true
    infoBox: true,
    fullscreenButton: false, //全屏按钮,默认显示true
    scene3DOnly: false,
    shouldAnimate:true,
    locationBar: {
      enabled: true,
      fps: true,
      lonLatShow: true,
      showAltitude: true,
      lonLatFormat: "DEFAULT",
      distanceLegend: { enabled: false },
    },
    measurement: true,
    transparent: true,
    zoomButton: true,
    sceneMode: GeokeyGIS.SceneMode.SCENE3D,
    orderIndependentTranslucency:false,//设置自定义背景图片时关闭
    contextOptions: {
      requestWebgl2: true,
      webgl:{//设置自定义背景图片时开启
        alpha:true
      }
    },
  });
}
