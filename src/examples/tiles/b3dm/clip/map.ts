import {
  Plane,
  CMath,
  Color,
  Cartesian2,
  Cartesian3,
  Cartographic,
  ClippingPlane,
  CallbackProperty,
  JulianDate,
  Rectangle,
  ClippingPlaneCollection,
  defined,
  Matrix4,
  PolygonHierarchy,
  Transforms,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Geokey3DTileset,
  GeokeyTerrainProvider,
  PGEarthWidget,
  DrawPolygon,
  PGPageLOD,
  CustomShader,
  UniformType,
  LodMeshLayer,
  IonResource,
  StaticTrianglePrimitive
} from "geokey-gis";

const polygonArr: any = {};
let b3dmTileset: any;
const clippingPlanes: any[] = [];
const positions: any[] = [];
let polygon: any = undefined;
let dynamicPolygon: any = undefined;
const tileCollect: any[] = [];

export function drawPolygon() {
  const handler = window.viewer.screenSpaceEventHandler;

  handler.setInputAction((event: any) => {
    let position = window.viewer.scene.pickPosition(event.position);
    if (defined(position)) {
      positions.push(position);
    }
  }, ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((event: any) => {
    let point = window.viewer.scene.pickPosition(event.endPosition);
    if (defined(point)) {
      positions.pop();
      positions.push(point);
    }
    if (positions.length >= 2) {
      !defined(dynamicPolygon) &&
        //鼠标移动动态绘制多边形
        (dynamicPolygon = window.viewer.entities.add({
          polygon: {
            hierarchy: new CallbackProperty(() => {
              return new PolygonHierarchy(positions);
            }, false),
            material: Color.CYAN.withAlpha(0.5)
          }
        }));
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((event: any) => {
    // //清理之前的多边形
    if (defined(polygon)) {
      window.viewer.entities.remove(polygon);
    }
    if (defined(dynamicPolygon)) {
      window.viewer.entities.remove(dynamicPolygon);
    }
    // //构建剖切面
    drawShape();
    handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK);
    dynamicPolygon = undefined;
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

export async function load3DTileset() {
  // const modelCenter = Cartesian3.fromDegrees(112, 23, 0);
  // const modelMatrix = Transforms.eastNorthUpToFixedFrame(modelCenter);

  // const primitive = new StaticTrianglePrimitive(modelMatrix);

  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  // viewer.scene.primitives.add(primitive);

  let elevationLayer = new GeokeyTerrainProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem',
    requestVertexNormals: true,
    requestWaterMask: true
  });
  window.viewer.terrainProvider = elevationLayer;

  // b3dmTileset = await new Geokey3DTileset({
  //   url: 'http://14.22.86.227:12022/service/gis/3DModel/xms-3dtile/tileset.json?serviceName=xms_3dtile',
  //   // url: "http://192.168.1.16:3000/sanxian_b3dm_newtest1/tileset.json",
  //   // url: "http://14.22.86.227:12022/service/gis/3DModel/sanxian_b3dm_newtest1/tileset.json?serviceName=sanxia_qxsy&uuid=1",
  //   // url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sanxia_qxsy',
  //   // url: 'http://14.22.86.227:12022/service/gis/3DModel/Scene/Production_2.json?uuid=633463e9-97e2-47e1-86f6-85edb862c4cd&serviceName=sz_hsl_b3dm20231109',
  //   // maximumMemoryUsage: 512
  //   maximumScreenSpaceError: 1
  // }).readyPromise;

  // window.viewer.scene.primitives.add(b3dmTileset);

  // window.viewer.zoomTo(b3dmTileset);
}

function getTileCollection(rectRange, tile) {
  if (tile.children.length) {
    tile.children.forEach(child => {
      let childIntersect = Rectangle.intersection(rectRange, child.rectangle);
      if (childIntersect && child.level > 15) {
        tileCollect.push(child);
      }
      // getTileCollection(rectRange, child)
    });
  }
}

function drawShape() {
  const drawRect = Rectangle.fromCartesianArray(positions);

  const quadtreeTiles = window.viewer.scene.globe._surface._tilesToRender;
  quadtreeTiles.forEach(tile => {
    getTileCollection(drawRect, tile);
  });

  tileCollect.forEach(tile => {
    const terrainDataPromise = window.viewer.terrainProvider.requestTileGeometry(tile.x, tile.y, tile.level);
    Promise.resolve(terrainDataPromise).then(terrainData => {
      const meshPromise = terrainData.createMesh(tile.tilingScheme, tile.x, tile.y, tile.level, 0.0);
      Promise.resolve(meshPromise)
        .then(function (mesh) {
          console.log('mesh: ', mesh);
        })
      //   .catch(function () {});
    });
  });
}

export async function widgetsFlat3DTiles() {
  let selectedPlane: any;
  let targetY: number = 0.0;

  const memoryInfo = (performance as any).memory;

  const usedMemoryBefore = memoryInfo.usedJSHeapSize;
  const totalMemory = memoryInfo.totalJSHeapSize;

  const availableMemory = memoryInfo.totalJSHeapSize - memoryInfo.usedJSHeapSize;

  // const boundingSphere = b3dmTileset.boundingSphere;
  // const radius = boundingSphere.radius;

  const usedMemoryAfter = memoryInfo.usedJSHeapSize;
  const positionsLength = positions.length;
  for (let i = 0; i < positionsLength; i++) {
    let nextIndex = (i + 1) % positionsLength;
    //计算两个点之间的中点
    let midpoint = Cartesian3.add(positions[i], positions[nextIndex], new Cartesian3());
    midpoint = Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
    //中点位置的上方向
    if (positions[nextIndex].x == midpoint.x && positions[nextIndex].y == midpoint.y && positions[nextIndex].z == midpoint.z) {
    } else {
      let up = Cartesian3.normalize(midpoint, new Cartesian3());
      //计算右方向
      let right = Cartesian3.subtract(positions[nextIndex], midpoint, new Cartesian3());
      right = Cartesian3.normalize(right, right);
      //上方向与右方向求叉积，叉积是与右方向与上方向是垂直的
      let normal = Cartesian3.cross(right, up, new Cartesian3());
      //顺时针
      normal = Cartesian3.negate(Cartesian3.normalize(normal, normal), normal);
      //构建平面
      let originCenteredPlane = new Plane(normal, 0.0);
      //中点到平面的距离
      let distance = Plane.getPointDistance(originCenteredPlane, midpoint);
      //存储动态绘制的剖切面
      clippingPlanes.push(new ClippingPlane(normal, distance));
    }
  }

  window.viewer.scene.globe.clippingPlanes = new ClippingPlaneCollection({
    planes: clippingPlanes,
    edgeColor: Color.RED,
    edgeWidth: 2.0,
    enabled: true,
    unionClippingRegions: false //设置为true，即取并集,false 交集
  });

  // b3dmTileset.clippingPlanes = new ClippingPlaneCollection({
  //   planes: clippingPlanes,
  //   edgeWidth: 1
  // });

  // for (let i = 0; i < b3dmTileset.clippingPlanes.length; i++) {
  //   let plane = b3dmTileset.clippingPlanes.get(i);
  //   window.viewer.entities.add({
  //     position: boundingSphere.center,
  //     plane: {
  //       dimensions: new Cartesian2(radius * 0.1, radius * 0.1),
  //       material: Color.RED.withAlpha(0.01),
  //       plane: new CallbackProperty((JulianDate: JulianDate) => {
  //         plane.distance = targetY;
  //         return plane;
  //       }, false),
  //       outline: true,
  //       outlineColor: Color.WHITE
  //     }
  //   });
  // }

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
