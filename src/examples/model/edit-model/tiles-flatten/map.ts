import {
  Color,
  CMath,
  Cartesian3,
  Cartographic,
  BoundingSphere,
  Matrix4,
  ClippingPlane,
  HeadingPitchRange,
  ClippingPlaneCollection,
  PolygonHierarchy,
  PolygonGeometry,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Geokey3DTileset,
  Geokey3DTileStyle,
  Transforms,
  FlattenTile,
  StaticTrianglePrimitive
} from "geokey-gis";

let tileset: Geokey3DTileset;
let flattens: FlattenTile;
const polygonArr: any = {};
const degreesArrayHeights: number[] = [];

export function drawFlatten() {
  const downHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  downHandler.setInputAction((movement: any) => {
    const pickedObject = window.viewer.scene.pick(movement.position);
    const pickedPosition = window.viewer.scene.pickPosition(movement.position);
    const cartographic = Cartographic.fromCartesian(pickedPosition);
    let lon = CMath.toDegrees(cartographic.longitude);
    let lat = CMath.toDegrees(cartographic.latitude);
    degreesArrayHeights.push(lon, lat, 30);
  }, ScreenSpaceEventType.LEFT_DOWN);

  const moveHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  moveHandler.setInputAction((movement: any) => {}, ScreenSpaceEventType.MOUSE_MOVE);

  const upHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  upHandler.setInputAction((movement: any) => {
    console.log(degreesArrayHeights);
  }, ScreenSpaceEventType.RIGHT_DOWN);
}

export function testFlatten(height: number) {
  flattens.addFlattenPlane({
    positions: Cartesian3.fromDegreesArrayHeights([
      114.49031743659374, 22.64646998587102, 200, 114.49118824654123, 22.64667976510497, 200, 114.49134037988868, 22.64607058627925, 200, 114.49051590821814, 22.64586642932514, 0
    ]),
    height: height,
    id: 11
  });
}

export function removeFlatten() {
  flattens.removePolygonById(11);
}

export async function addTileset() {
  tileset = await new Geokey3DTileset({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/Scene/Production_2.json?uuid=633463e9-97e2-47e1-86f6-85edb862c4cd&serviceName=sz_hsl_b3dm20231109',
    maximumScreenSpaceError: 1
  }).readyPromise;
  window.viewer.scene.primitives.add(tileset);

  window.viewer.zoomTo(tileset);

  flattens = new FlattenTile(tileset, {
    flattenHeight: 0
  });
}

export function loadGrandCanyon() {
  let position = Cartographic.toCartesian(Cartographic.fromDegrees(109.2665534, 22.0939345, 10));
  let distance = 1000000.0;
  let boundingSphere = new BoundingSphere(position, distance);

  window.viewer.scene.globe.clippingPlanes = new ClippingPlaneCollection({
    modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
    planes: [
      new ClippingPlane(new Cartesian3(1.0, 0.0, 0.0), distance),
      new ClippingPlane(new Cartesian3(-1.0, 0.0, 0.0), distance),
      new ClippingPlane(new Cartesian3(0.0, 1.0, 0.0), distance),
      new ClippingPlane(new Cartesian3(0.0, -1.0, 0.0), distance)
    ],
    unionClippingRegions: true,
    edgeWidth: 1.0,
    edgeColor: Color.WHITE,
    enabled: true
  });
  window.viewer.camera.viewBoundingSphere(boundingSphere, new HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0));
  window.viewer.camera.lookAtTransform(Matrix4.IDENTITY);
}
