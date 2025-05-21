import { Geokey3DTileset } from "geokey-gis";

export async function loadPGEarth3DTile() {
  const tileset = await new Geokey3DTileset({
    url: 'http://36.134.121.186:10010/yb/moxing/ludeng/tileset.json'
  }).readyPromise;
  window.viewer.zoomTo(tileset);
  window.viewer.scene.primitives.add(tileset);
}
