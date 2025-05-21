import { GeokeyTerrainProvider ,Cartesian3} from 'geokey-gis';

export function loadTerrainLayer() {
  const elevationLayer = new GeokeyTerrainProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem',
    requestVertexNormals: true,
    requestWaterMask: true
  });
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(114.2379, 22.6057, 2000)
  })
  window.viewer.terrainProvider = elevationLayer;
}
export function terrainExaggeration(height){
  window.viewer.scene.globe.terrainExaggeration = height;
}
