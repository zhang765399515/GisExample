import { GeokeyTerrainProvider ,Cartesian3} from 'geokey-gis';

export async function loadTerrainLayer() {
  const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
    requestVertexNormals: true,
    requestWaterMask: true
  });

  window.viewer.terrainProvider = elevationLayer;
}
export function terrainExaggeration(height){
  console.log('name：height',height);
  window.viewer.scene.globe.terrainExaggeration = height;
}
