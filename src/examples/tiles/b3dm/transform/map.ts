import { CMath, Cartesian3, Geokey3DTileset, Event, Transforms, TilesetTransform, Matrix3, Matrix4, ModelCoordinateSystem, Color } from "geokey-gis";

const ModelLoadedEvent = new Event();
let tileset: Geokey3DTileset;
let tilesetTransform: TilesetTransform;
/**
 * 加载3DTiles模型
 */
export async function load3dtiles() {
  tileset = await new Geokey3DTileset({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/yantian_1_1/tileset.json?serviceName=yantian_qxsy1_b3dm&uuid=1',
    maximumScreenSpaceError: 0.5
  }).readyPromise;

  const tilesetPrimitive = window.viewer.scene.primitives.add(tileset);
  window.viewer.zoomTo(tileset);
}

export function getModelPosition() {
  if (tileset) {
    tilesetTransform = new TilesetTransform(window.viewer, tileset);
    return tilesetTransform.getParams();
  }
}

export function tilesetRotate(location: any) {
  tilesetTransform.updateModelMatrix(location);
}
