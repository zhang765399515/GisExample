import {
  Appearance,
  geoArcGisBaseLayer,
  BoundingSphere,
  Color,
  Cartesian3,
  ComponentDatatype,
  BlendOption,
  Geometry,
  GeometryAttribute,
  PrimitiveType,
  PointPrimitiveCollection,
  LightPointPrimitiveCollection,
  SceneView,
  SceneMode,
  Material,
  GeometryInstance,
  GeographicTilingScheme,
  CircleGeometry,
  CMath,
  VertexFormat,
  Primitive,
  EllipsoidSurfaceAppearance,
  MaterialAppearance,
  WebMapServiceImageryProvider
} from "geokey-gis";
import hugeData1 from '@/assets/data/lights.json';
// import hugeData from '@/assets/data/huge.json';
import hugeData from './zk.json';

let pointPrimitives: any;
/**
 * 初始化3D地图模块 - 蓝色地图
 * @param domRef - 地图实例DOM元素
 */
export function initMap(domRef: Element) {
  const viewer = new SceneView({
    container: domRef,
    baseMap: new geoArcGisBaseLayer({
      url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
    }),
    // baseLayerPicker: true,
    scene3DOnly: false,
    sceneMode: SceneMode.SCENE3D
  });
  viewer.scene.requestRenderMode = false; //开启动态水面
  viewer.scene.globe.depthTestAgainstTerrain = false; //开启坐标深度拾取

  return viewer;
}

// export function loadHugePromitiveData() {
//
//   let color;
//   window.viewer.camera.changed.addEventListener(() => {
//     let height = window.viewer.camera.positionCartographic.height;
//     if (height < 26854.42376726627) {
//       color = Color.fromAlpha(Color.fromCssColorString('#fdef50'), 0.8);
//     } else {
//       color = Color.fromAlpha(Color.fromCssColorString('#fdef50'), 0.5);
//     }
//   });

// }

export function loadHugeCustomPromitiveData() {
  window.viewer.scene.requestRenderMode = false;
  pointPrimitives && window.viewer.scene.primitives.remove(pointPrimitives);
  pointPrimitives = window.viewer.scene.primitives.add(new LightPointPrimitiveCollection());

  // const pointData = (hugeData as any)[0].data;
  const pointData = (hugeData as any);
  for (let j = 0; j < (pointData as any).length; j++) {
    // let position = Cartesian3.fromDegrees(+(pointData as any)[j]._geometry.coordinates[0], +(pointData as any)[j]._geometry.coordinates[1], 0);
    let position = Cartesian3.fromDegrees(+(pointData as any)[j].POINT_X * 1,+(pointData as any)[j].POINT_Y * 1,2)
    let color = Color.fromAlpha(Color.fromCssColorString('#ffff00'), 0.8);
    pointPrimitives.add({
      pixelSize: 30,
      color: color,
      position: position,
    });
  }
}

export function loadHugePromitiveData() {
  // const customLayer = new WebMapServiceImageryProvider({
  //   url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_qx_jiedao_mian',
  //   layers: "0",
  //   tilingScheme: new GeographicTilingScheme(),
  //   enablePickFeatures: true
  // });
  // window.viewer.imageryLayers.addImageryProvider(customLayer);

  window.viewer.scene.requestRenderMode = false;
  pointPrimitives && window.viewer.scene.primitives.remove(pointPrimitives);
  pointPrimitives = window.viewer.scene.primitives.add(
    new PointPrimitiveCollection({
      // blendOption: BlendOption.OPAQUE
    })
  );

  // (Material as any).PointGlowType = 'PolylineGlow';
  // (Material as any)._materialCache.addMaterial((Material as any).PointGlowType, {
  //   fabric: {
  //     type: (Material as any).PointGlowType,
  //     uniforms: {
  //       color: Color.YELLOW,
  //       glowPower: 0.15,
  //       taperPower: 2.0
  //     },
  //     source: `
  //       uniform vec4 color;
  //       uniform float glowPower;
  //       uniform float taperPower;
  //       czm_material czm_getMaterial(czm_materialInput materialInput){
  //           czm_material material = czm_getDefaultMaterial(materialInput);
  //           vec2 st = materialInput.st;
  //           float glow = glowPower / distance(st, vec2(0.5, 0.5)) - (glowPower / 0.5);
  //           if (taperPower <= 0.99999) {
  //               glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
  //           }
  //           vec4 fragColor;
  //           fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
  //           fragColor.a = clamp(0.0, 1.0, glow) * color.a;
  //           fragColor = czm_gammaCorrect(fragColor);
  //           material.emission = fragColor.rgb;
  //           material.alpha = fragColor.a;
  //           return material;
  //       }
  //     `
  //   },
  //   translucent: true
  // });

  // window.viewer.scene.globe.depthTestAgainstTerrain = false;
  // window.viewer.scene.requestRenderMode = false;
  const pointData = (hugeData as any)[0].data;
  for (let j = 0; j < (pointData as any).length; j++) {
    let position = Cartesian3.fromDegrees(+(pointData as any)[j]._geometry.coordinates[0], +(pointData as any)[j]._geometry.coordinates[1], 0);
    // // if (i % 10 == 0) {
    // //   color = Color.fromAlpha(Color.fromCssColorString('#fdef50'), 0.8);
    // // } else if (i % 10 != 0) {
    let color = Color.fromAlpha(Color.fromCssColorString('#ffff00'), 0.8);
    // // }
    pointPrimitives.add({
      pixelSize: 10,
      color: color,
      position: position
    });
    //   // const instance = new GeometryInstance({
    //   //   geometry: new CircleGeometry({
    //   //     center: position,
    //   //     radius: 10.0
    //   //   }),
    //   //   id: 'point'
    //   // });
    //   // window.viewer.scene.primitives.add(
    //   //   new Primitive({
    //   //     geometryInstances: instance,
    //   //     appearance: new MaterialAppearance({
    //   //       material: Material.fromType('PolylineGlow')
    //   //     })
    //   //   })
    //   // );
  }
}

function createGeometry(positions: any, indices: Uint16Array) {
  return new Geometry({
    attributes: {
      position: new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 3,
        values: positions
      })
    } as any,
    indices: indices,
    primitiveType: PrimitiveType.POINTS,
    boundingSphere: BoundingSphere.fromVertices(positions)
  });
}

function createAppearence() {
  return new Appearance({
    // renderState: {
    //   blending: BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
    //   depthTest: { enabled: true },
    //   depthMask: true
    // },
    material: new Material({
      fabric: {
        type: 'Color',
        uniforms: {
          color: new Color(1.0, 1.0, 0.0, 1.0)
        }
      }
    })
    // vertexShaderSource: `
    //   varying vec4 v_color;
    //   void main(){
    //       float d = distance(gl_PointCoord, vec2(0.5,0.5));
    //       if(d < 0.5){
    //           gl_FragColor = v_color;
    //       }else{
    //           discard;
    //       }
    //   }
    // `,
    // fragmentShaderSource: `
    //   attribute vec3 position3DHigh;
    //   attribute vec3 position3DLow;
    //   attribute vec4 color;
    //   varying vec4 v_color;
    //   attribute float batchId;
    //   void main(){
    //       vec4 p = czm_computePosition();
    //       v_color =color;
    //       p = czm_modelViewProjectionRelativeToEye * p;
    //       gl_Position = p;
    //       gl_PointSize=8.0;
    //   }
    // `
  });
}
