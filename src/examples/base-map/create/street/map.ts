import { SceneView,ImageryLayer,  WebMapTileServiceImageryProvider, SceneMode } from 'geokey-gis';

let viewer: SceneView;
/**
 * 初始化3D地图模块
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  viewer = new SceneView({
    container: domRef,
    baseLayer: new ImageryLayer(
      new WebMapTileServiceImageryProvider({
        url: 'http://basemap.igeokey.com:12023/basemap/gis/getTdtMap/163028b5f90eb2f64439c4d81349b5b6/3/tile/{TileMatrix}/{TileRow}/{TileCol}',
        layer: '',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible'
      })
    ),
    geocoder: true, //地名查找,默认true
    homeButton: false, //主页按钮，默认true
    sceneModePicker: true, // 2D,3D和Columbus View切换控件
    baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
    navigationHelpButton: false, // 帮助提示控件
    animation: false, //视图动画播放速度控件，默认true
    timeline: false, //时间线,默认true
    fullscreenButton: true, //全屏按钮,默认显示true
    infoBox: true, //点击要素之后显示的信息,默认true
    selectionIndicator: false, //选中元素显示,默认true
    scene3DOnly: false, // 仅3D渲染，节省GPU内存
    sceneMode: SceneMode.SCENE3D
  });

  return viewer;
}
