import {
  Ray,
  Color,
  defined,
  Entity,
  Cartesian3,
  IntersectionTests,
  CallbackProperty,
  PolygonGeometry,
  Geometry,
  GeometryAttribute,
  ComponentDatatype,
  BoundingSphere,
  ScreenSpaceEventHandler,
  PerInstanceColorAppearance,
  CoplanarPolygonGeometry,
  UniformType,
  LightingModel,
  CustomShader,
  Primitive,
  ScreenSpaceEventType,
  GeometryInstance,
  ColorGeometryInstanceAttribute,
  GeokeyTerrainProvider,
  Geokey3DTileset,
  PolygonHierarchy,
  EventDriven
} from "geokey-gis";

import RapidFlatten from './RapidFlatten';

let timer: any = undefined;
let fristPoint: any = undefined;
let positions: Cartesian3[] = [];
let primitive = undefined;
let tileset: Geokey3DTileset | undefined = undefined;

export async function updateExaggeration(val: number) {
  window.window.viewer.scene.globe.depthTestAgainstTerrain = true;
  let elevationLayer = new GeokeyTerrainProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem',
    requestVertexNormals: true,
    requestWaterMask: true
  });
  window.window.viewer.terrainProvider = elevationLayer;

  // positions = [];
  // const layerEvent = new EventDriven(window.viewer);

  // layerEvent.addEvent('LEFT_CLICK', (data: EventDriven.EventReturnDataType) => {
  //   const point = data.cartesian;
  //   if (defined(point)) {
  //     positions.push(point);
  //   }
  // });
  // layerEvent.addEvent('MOUSE_MOVE', (data: EventDriven.EventReturnDataType) => {
  //   positions.pop();
  //   positions.push(data.cartesian);
  //   drawFlattenPrimitive();
  // });

  // layerEvent.addEvent('RIGHT_CLICK', (data: EventDriven.EventReturnDataType) => {
  //   layerEvent.removeEvent('MOUSE_MOVE');
  //   layerEvent.removeEvent('LEFT_CLICK');
  //   layerEvent.removeEvent('RIGHT_CLICK');
  //   positions.push(positions[0]);
  //   drawFlattenPrimitive();
  // });
}

export function tileFlatten() {
  const dc = new Cartesian3();
  let polygonPos = [];
  let polygon = undefined;
  let isDrawing = true;
  let points: Cartesian3[] = [];
  window.viewer.entities.removeAll();
  const handler = new ScreenSpaceEventHandler(window.window.viewer.scene.canvas);
  handler.setInputAction((evt: any) => {
    const ray = window.viewer.camera.getPickRay(evt.position) as Ray;
    const radiusCartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);

    if (radiusCartesian) {
      points.push(radiusCartesian);
    }

    if (points.length == 2) {
      let subtract = Cartesian3.subtract(points[1], points[0], new Cartesian3());
      let normalize = Cartesian3.normalize(subtract, new Cartesian3());
      const intersection = IntersectionTests.rayEllipsoid(ray, window.viewer.scene.globe.ellipsoid);
      const rayTodirection = new Ray(radiusCartesian, normalize);
      const result = (window.viewer.scene as any).drillPickFromRay(rayTodirection);
      result.forEach((item: any) => {
        window.viewer.entities.add({
          position: item.position,
          point: {
            color: Color.DEEPPINK,
            pixelSize: 10
          }
        });
      });
      window.viewer.entities.add({
        polyline: {
          positions: new CallbackProperty(function () {
            return [points[0], Cartesian3.add(points[0], subtract, new Cartesian3())];
          }, false),
          width: 2,
          material: Color.RED
        }
      });
    }

    // const pickpos = window.viewer.scene.pickPosition(evt.position);
    // if (isDrawing) {
    //   if (polygonPos.length > 2 && !polygon) {
    //     polygon = window.viewer.entities.add({
    //       polygon: {
    //         hierarchy: new CallbackProperty(() => {
    //           return new PolygonHierarchy(polygonPos);
    //         }, false),
    //         material: Color.fromCssColorString('#e36d62').withAlpha(0.5),
    //         perPositionHeight: true
    //       }
    //     });
    //   }
    //   if (pickpos) {
    //     polygonPos.push(pickpos);
            // points.push(
            // window.viewer.entities.add({
            //   position: ccc,
            //   point: {
            //     color: Color.DEEPPINK,
            //     pixelSize: 10
            //   }
            // });
    // );
    //   }
    // }
  }, ScreenSpaceEventType.LEFT_CLICK);
  // handler.setInputAction(evt => {
  //   if (polygon) {
  //     polygon.polygon = {
  //       hierarchy: new PolygonHierarchy(polygonPos),
  //       material: Color.fromCssColorString('#a8e362').withAlpha(0.2),
  //       perPositionHeight: true
  //     };
  //     let customerShader = new CustomShader({
  //       lightingModel: LightingModel.UNLIT,
  //       uniforms: {
  //         u1pos: {
  //           type: UniformType.VEC3,
  //           value: polygonPos[0]
  //         },
  //         u2pos: {
  //           type: UniformType.VEC3,
  //           value: polygonPos[1]
  //         },
  //         u3pos: {
  //           type: UniformType.VEC3,
  //           value: polygonPos[2]
  //         },
  //         u4pos: {
  //           type: UniformType.VEC3,
  //           value: polygonPos[3]
  //         }
  //       },
  //       vertexShaderText: `
  //         void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
  //           vec3 p = vsOutput.positionMC;
  //           float px = p.x;
  //           float pz = p.z;

  //           vec4 u1posMC = czm_inverseModel * vec4(u1pos,1.);
  //           vec4 u2posMC = czm_inverseModel * vec4(u2pos,1.);
  //           vec4 u3posMC = czm_inverseModel * vec4(u3pos,1.);
  //           vec4 u4posMC = czm_inverseModel * vec4(u4pos,1.);

  //           bool flag = false;
  //           vec4 tem1;
  //           vec4 tem2;
  //           for(int i=0;i<4;i++){
  //               if(i == 0) {
  //                 tem1 = u1posMC;
  //                 tem2 = u4posMC;
  //               }
  //               else if(i == 1){
  //                 tem1 = u2posMC;
  //                 tem2 = u1posMC;
  //                 }
  //               else if(i == 2){
  //                 tem1 = u3posMC;
  //                 tem2 = u2posMC;
  //                 }
  //               else {
  //                 tem1 = u4posMC;
  //                 tem2 = u3posMC;
  //               }

  //               float sx = tem1.x;
  //               float sz = tem1.z;
  //               float tx = tem2.x;
  //               float tz = tem2.z;

  //               if((sx == px && sz ==pz) ||(tx == px && tz ==pz)){
  //                   // return true;
  //                   // return
  //               }

  //               if((sz < pz && tz >= pz) || (sz >= pz && tz < pz)) {
  //                 float x = sx + (pz - sz) * (tx - sx) / (tz - sz);
  //                 if(x == px) {
  //                     // return true;
  //                     // return
  //                 }
  //                 if(x > px) {
  //                     flag = !flag;
  //                 }
  //               }

  //             }//for end

  //             if(flag){
  //               vsOutput.positionMC.y = tem1.y;
  //             }
  //           }`
  //     });
  //     tileset.customShader = customerShader;
  //   }

  //   isDrawing = false;
  // }, ScreenSpaceEventType.RIGHT_CLICK);

  function draw() {
    isDrawing = true;
  }
  function remove() {
    isDrawing = false;
    polygonPos = [];
    points.forEach(item => {
      window.viewer.entities.remove(item);
    });
    points = [];
    window.viewer.entities.remove(polygon);
    polygon = undefined;
  }
}

function drawFlattenPrimitive() {
  if (positions.length) {
    const hierarchy = new PolygonHierarchy(positions);
    // 创建多边形几何体
    const polygonGeometry = new PolygonGeometry({
      polygonHierarchy: hierarchy,
      vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
      perPositionHeight: true
    });
    // 创建几何体实例
    const geometryInstance = new GeometryInstance({
      geometry: polygonGeometry,
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(Color.RED.withAlpha(0.5))
      }
    });
    // 创建渲染的Primitive
    primitive = new Primitive({
      geometryInstances: geometryInstance,
      appearance: new PerInstanceColorAppearance({ flat: true, translucent: false })
    });

    primitive && window.viewer.scene.primitives.remove(primitive);
    window.viewer.scene.primitives.add(primitive);
  }
}
