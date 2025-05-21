import { Color, SkyBox, Geokey3DTileset, Geokey3DTilesInspector, viewerGeokey3DTilesInspectorMixin } from 'geokey-gis';
export async function load() {
  let viewer = window.viewer;
  viewer.scene.sun.glowFactor = 10;
  const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_shenzhen_jianzhu1&uuid=1');
  // viewer.zoomTo(tileset);
  window.viewer.goTo({
    center: [114.13219854163002, 22.601828288191225, 500]
  });
  viewer.scene.primitives.add(tileset);
  window.viewer.scene.globe.enableLighting = true;
  window.viewer.shadows = true;
  window.viewer.clock.multiplier = 10000;
  // new Geokey3DTilesInspector('basemap', viewer.scene)
  // console.log('name：viewerCesium3DTilesInspectorMixin',viewerGeokey3DTilesInspectorMixin);
  // viewer.extend(viewerGeokey3DTilesInspectorMixin);
  viewer.extend(viewerGeokey3DTilesInspectorMixin, {
    tileset: tileset
  });
//   tileset.debugShowBoundingVolume = true; // 显示包围盒
// tileset.debugShowContentBoundingVolume = true; // 显示内容包围盒
// tileset.debugShowGeometricError = true; // 显示几何误差
}
