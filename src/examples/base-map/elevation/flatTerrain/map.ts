import { Cartesian3, GeokeyTerrainProvider, Geokey3DTileset } from "geokey-gis";

export function loadSurfacePierce() {
  window.viewer.surfacePierce.enable = true;
}

export function unloadSurfacePierce() {
  window.viewer.surfacePierce.enable = false;
}

export function updateSurfacePierce(val: number) {
  window.viewer.surfacePierce.alpha = val;
}

export async function updateExaggeration(val: number) {
  let elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem', {
    requestVertexNormals: true,
    requestWaterMask: true
  });
  window.viewer.terrainProvider = elevationLayer;

  try {
    const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=qxsy_lhqxc_b3', {
      maximumScreenSpaceError: 2,
      lightColor: new Cartesian3(10, 10, 10)
    });
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
  } catch {
    console.log("加载3DTile失败");
  }
}
