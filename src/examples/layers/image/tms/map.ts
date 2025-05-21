import {
  Cartesian3,
  GeographicTilingScheme,
  ImageryLayer,
  Ray,
  WebMapServiceImageryProvider,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  geoWMSLayer,
  MapboxStyleImageryProvider
} from "geokey-gis";

/**
 * 加载TMSlayer影像图
 * @param {}
 */
export function loadTMSLayer() {
  // const layer2 = new WebMapServiceImageryProvider({
  //   url: 'http://139.9.106.119:12022/service/gis/3DModel/?serviceName=sz_yantian_zst',
  //   layers: '',
  //   tilingScheme: new GeographicTilingScheme(),
  //   enablePickFeatures: false
  // });
  window.viewer.scene.globe.depthTestAgainstTerrain = false; //开启坐标深度拾取
  const wmsLayer = geoWMSLayer({
    // url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_shijixz'
    // url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_ZK_point',
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dzt_mian0524',
    layers: 'zhuankong'
  });
  window.viewer.imageryLayers.addImageryProvider(wmsLayer);
  // window.viewer.map.add(wmsLayer);

  const handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  //鼠标点击事件
  handler.setInputAction((event: any) => {
    console.log('event: ', event);
    //获取加载地形后对应的经纬度和高程：地标坐标
    let ray: Ray = window.viewer.camera.getPickRay(event.position) as Ray;
    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    console.log('cartesian: ', cartesian);
  }, ScreenSpaceEventType.LEFT_CLICK);
  // window.viewer.camera.flyTo({
  //   destination: Cartesian3.fromDegrees(114.234808, 22.562103, 5000)
  // });
  const baselayer = new MapboxStyleImageryProvider({
    url: 'https://api.mapbox.com/styles/v1',
    username: 'freedom616',
    styleId: 'cldvey3nd000301nwhhsnkzlu',
    accessToken: 'pk.eyJ1IjoiZnJlZWRvbTYxNiIsImEiOiJjbDdzY2dtOXMwM3E2M3ZxZXE2bHF2MWR2In0.Wl44fDwQngYXIF0ItMTjVw'
  });
  const layer = new MapboxStyleImageryProvider({
    url: 'https://api.mapbox.com/styles/v1',
    username: 'freedom616',
    styleId: 'cl8b2xnxv000b14pq6p4gxwzg',
    accessToken: 'pk.eyJ1IjoiZnJlZWRvbTYxNiIsImEiOiJjbDdzY2dtOXMwM3E2M3ZxZXE2bHF2MWR2In0.Wl44fDwQngYXIF0ItMTjVw'
  });

  const blacklayer = new MapboxStyleImageryProvider({
    url: 'https://api.mapbox.com/styles/v1',
    username: 'freedom616',
    styleId: 'cl7zzyj0i001315mlwzzqp8n9',
    accessToken: 'pk.eyJ1IjoiZnJlZWRvbTYxNiIsImEiOiJjbDdzY2dtOXMwM3E2M3ZxZXE2bHF2MWR2In0.Wl44fDwQngYXIF0ItMTjVw'
  });
  // window.viewer.imageryLayers.addImageryProvider(blacklayer);
  window.viewer.imageryLayers.addImageryProvider(baselayer);
  // window.viewer.imageryLayers.addImageryProvider(layer);
}
