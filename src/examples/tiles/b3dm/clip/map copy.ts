import {
  CMath,
  Color,
  Cartesian2,
  Cartesian3,
  Cartographic,
  ClippingPlane,
  CallbackProperty,
  JulianDate,
  ClippingPlaneCollection,
  defined,
  Matrix4,
  Transforms,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Geokey3DTileset,
  PGEarthWidget,
  DrawPolygon,
  PGPageLOD,
  CustomShader,
  UniformType,
  LodMeshLayer,
  IonResource
} from "geokey-gis";

const polygonArr: any = {};
let b3dmTileset: Geokey3DTileset | PGPageLOD;

export function ccc() {
  const point_car3 = new Cartesian3(-2407791, 5379748, 2429246);
  const jwh = Cartographic.fromCartesian(point_car3);
  let x = CMath.toDegrees(jwh.longitude);
  let y = CMath.toDegrees(jwh.latitude);
  let cart3 = Cartesian3.fromDegrees(x, y, 0);
  let m1 = Transforms.eastNorthUpToFixedFrame(cart3);
  var inv_m1 = Matrix4.inverse(m1, new Matrix4());
  let center_local = Matrix4.multiplyByPoint(inv_m1, point_car3, new Cartesian3());
}

export async function widgetsFlat3DTiles() {
  let selectedPlane: any;
  let targetY: number = 0.0;

  b3dmTileset = new Geokey3DTileset({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=qxsy_15haoxian'
  });
  window.viewer.scene.primitives.add(b3dmTileset);
  b3dmTileset.readyPromise.then((tileset: any) => {
    const boundingSphere = tileset.boundingSphere;
    const radius = boundingSphere.radius;

    tileset.clippingPlanes = new ClippingPlaneCollection({
      planes: [new ClippingPlane(new Cartesian3(0.0, 0.0, -1.0), 0)],
      edgeWidth: 3
    });

    for (let i = 0; i < tileset.clippingPlanes.length; i++) {
      let plane = tileset.clippingPlanes.get(i);
      window.viewer.entities.add({
        position: boundingSphere.center,
        plane: {
          dimensions: new Cartesian2(radius * 1.5, radius * 1.5),
          material: Color.WHITE.withAlpha(0.01),
          plane: new CallbackProperty((JulianDate: JulianDate) => {
            plane.distance = targetY;
            return plane;
          }, false),
          outline: true,
          outlineColor: Color.WHITE
        }
      });
    }

    window.viewer.zoomTo(tileset);
  });

  const downHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  downHandler.setInputAction((movement: any) => {
    const pickedObejct = window.viewer.scene.pick(movement.position);
    if (defined(pickedObejct) && defined(pickedObejct.id) && defined(pickedObejct.id.plane)) {
      selectedPlane = pickedObejct.id.plane;
      selectedPlane.material = Color.WHITE.withAlpha(0.1);
      selectedPlane.outlineColor = Color.WHITE;
      window.viewer.scene.screenSpaceCameraController.enableInputs = false;
    }
  }, ScreenSpaceEventType.LEFT_DOWN);

  const upHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  upHandler.setInputAction((movement: any) => {
    if (defined(selectedPlane)) {
      selectedPlane.material = Color.WHITE.withAlpha(0.2);
      selectedPlane.outlineColor = Color.WHITE;
      selectedPlane = undefined;
    }
    window.viewer.scene.screenSpaceCameraController.enableInputs = true;
  }, ScreenSpaceEventType.LEFT_UP);

  const moveHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  moveHandler.setInputAction((movement: any) => {
    if (defined(selectedPlane)) {
      const deltaY = movement.startPosition.y - movement.endPosition.y;
      targetY += deltaY;
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);
}
