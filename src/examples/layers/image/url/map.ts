import {
  DefaultProxy,
  GeographicTilingScheme,
  WebMercatorTilingScheme,
  ArcGisMapServerImageryProvider,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider
} from "geokey-gis";

export function loadURLTemplate() {
  let tempLayer = new UrlTemplateImageryProvider({
    url: 'http://basemap.igeokey.com:12023/basemap/gis/getArcgisMap/9/{z}/{y}/{x}',
    maximumLevel: 19
  });
  window.viewer.map.add(tempLayer);
  window.viewer.flyTo(tempLayer as any);
}

export function loadArcGisMapServer() {
  let tempLayer = new ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  });
  window.viewer.map.add(tempLayer);
  window.viewer.flyTo(tempLayer as any);
}

export function loadWebMapService() {
  let tempLayer = new WebMapServiceImageryProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yn_xjxz_bai',
    layers: 'yn_xjxz_bai',
  });
  window.viewer.imageryLayers.addImageryProvider(tempLayer);
}

export function loadWebMapTileService() {
  let tempLayer = new WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=1d109683f4d84198e37a38c442d68311',
    layer: 'tdtAnnoLayer',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible'
  });
  window.viewer.imageryLayers.addImageryProvider(tempLayer);
}
