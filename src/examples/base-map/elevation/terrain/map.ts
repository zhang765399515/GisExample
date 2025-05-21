import { GeokeyTerrainProvider } from 'geokey-gis';

export async function loadTerrainLayer() {
  const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
    requestVertexNormals: true,
    requestWaterMask: true
  });

  window.viewer.terrainProvider = elevationLayer;
}
