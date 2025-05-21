import { geoSceneLayer, Geokey3DTileStyle, Geokey3DTileset } from 'geokey-gis';

/**
 * 加载点云效果
 */
export async function loadSceneLayerCloud() {
  window.viewer.scene.requestRenderMode = false;

  const sceneLayer = await Geokey3DTileset.fromUrl(
    'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=eryuan_dianyun',
  );
  sceneLayer.style = new Geokey3DTileStyle({ pointSize: 10 });

  window.viewer.scene.primitives.add(sceneLayer);

  window.viewer.zoomTo(sceneLayer);
}
