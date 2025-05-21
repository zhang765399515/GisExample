import {
  Color,
  Cartesian2,
  Cartesian3,
  Primitive,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Ray,
  CylinderGeometry,
  EllipsoidSurfaceAppearance,
  CircleGeometry,
  Matrix4,
  Transforms,
  PolygonGeometry,
  PolygonHierarchy,
  VertexFormat,
  WallGeometry
} from "geokey-gis";
import * as turf from '@turf/turf'
import drillData from "./drill.json"
export function loadCylinderGeometry() {
  const cylinderGeometry = new CylinderGeometry({
    length: 300.0, // 长度
    topRadius: 500.0, // 顶部半径
    bottomRadius: 500.0, // 底部半径
    // vertexFormat: VertexFormat.POSITION_AND_NORMAL
    // vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT
  });
  const dynamicTextureMappingMaterial = new Material({
    fabric: {
      //材质类型
      type: 'dynamicTextureMappingMaterial',
      //参数传递
      uniforms: {
        image: '/image/3DModel/1-2.png',
        color: Color.AQUAMARINE,
        textureScaleX: 1,
        textureScaleY: 1,
        repeat: new Cartesian2(1.0, 1.0)
      },
      source: `
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 coords = vec2(materialInput.st.s, materialInput.st.t);
            vec4 textureColor = texture2D(image, coords);
            material.diffuse = textureColor.rgb;
            return material;
          }`
      // source: `
      //   czm_material czm_getMaterial(czm_materialInput materialInput){
      //     czm_material material = czm_getDefaultMaterial(materialInput);
      //     // vec2 texCoords = vec2(materialInput.st.s, materialInput.st.t);
      //     vec2 texCoords = vec2(
      //       mod(materialInput.st.s * textureScaleX, 1.0), // x方向上的平铺
      //       mod(materialInput.st.t * textureScaleY, 1.0)  // y方向上的平铺
      //     );
      //     vec2 coords = materialInput.st;
      //     vec4 textureColor = texture2D(image, texCoords);
      //     material.diffuse = textureColor.rgb;

      //     return material;
      //   }`
    }
  });
  const cylinderPrimitive = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: cylinderGeometry,
      modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(114.41303861, 22.71387825, 100)),
    }),
    appearance: new MaterialAppearance({
      material: dynamicTextureMappingMaterial,
      translucent: false,
      closed: false,
      faceForward: true,
    }),
    // appearance: new MaterialAppearance({
    //     material: Material.fromType('Color', {
    //         color: Color.BLUE, // 材质
    //     }),
    // }),
  });
  window.viewer.scene.primitives.add(cylinderPrimitive);
  // 控制视角

  var position = Cartesian3.fromDegrees(114.41303861, 22.71387825, 10);

  // 创建圆柱体实体
  // var cylinder = window.viewer.entities.add({
  //     name: 'Cylinder with material',
  //     position: position,
  //     cylinder: {
  //         length: 400.0, // 圆柱体的高度
  //         topRadius: 200.0, // 圆柱体顶部的半径
  //         bottomRadius: 200.0, // 圆柱体底部的半径
  //         // material: new ImageMaterialProperty({
  //         //     image: '/image/3DModel/1-2.png', // 替换为你的图片路径
  //         //     repeat: new Cartesian2(5.0, 5.0) // 图片的重复模式
  //         // }),
  //     }
  // });
  window.viewer.goTo({
    center: [114.41303861, 22.71387825, 1000]
  });
}
export function loadCylinderGeometry2() {
  // 定义圆柱的位置
  window.viewer.goTo({
    center: [114.3168693263771, 22.608799765335885, 1000]
  });
  var positions = [
    114.32145583981543,
    22.605425226807714,
    200,
    114.3214424653363,
    22.605284100233433,
    200,
    114.32140274827574,
    22.6051472615805,
    200,
    114.32133789541652,
    22.605018868640922,
    200,
    114.32124987727994,
    22.60490282259804,
    200,
    114.32114136825253,
    22.604802649487446,
    200,
    114.32101566532621,
    22.604721393056035,
    200,
    114.32087658792076,
    22.604661522274686,
    200,
    114.3207283618328,
    22.604624856315592,
    200,
    114.320575490837,
    22.604612509274194,
    200,
    114.32042261984118,
    22.604624856315592,
    200,
    114.32027439375322,
    22.604661522274686,
    200,
    114.32013531634777,
    22.604721393056035,
    200,
    114.32000961342146,
    22.604802649487446,
    200,
    114.31990110439406,
    22.60490282259804,
    200,
    114.31981308625747,
    22.605018868640922,
    200,
    114.31974823339824,
    22.6051472615805,
    200,
    114.31970851633767,
    22.605284100233433,
    200,
    114.31969514185856,
    22.605425226807714,
    200,
    114.31970851633767,
    22.605566353237244,
    200,
    114.31974823339824,
    22.605703191473438,
    200,
    114.31981308625747,
    22.6058315837745,
    200,
    114.31990110439406,
    22.605947629034162,
    200,
    114.32000961342146,
    22.60604780131126,
    200,
    114.32013531634777,
    22.60612905695944,
    200,
    114.32027439375322,
    22.606188927102284,
    200,
    114.32042261984118,
    22.606225592644627,
    200,
    114.320575490837,
    22.6062379395413,
    200,
    114.3207283618328,
    22.606225592644627,
    200,
    114.32087658792076,
    22.606188927102284,
    200,
    114.32101566532621,
    22.60612905695944,
    200,
    114.32114136825253,
    22.60604780131126,
    200,
    114.32124987727994,
    22.605947629034162,
    200,
    114.32133789541652,
    22.6058315837745,
    200,
    114.32140274827574,
    22.605703191473438,
    200,
    114.3214424653363,
    22.605566353237244,
    200,
    114.32145583981543,
    22.605425226807714,
    200,
  ]
  // var positions = [
  //   {
  //     "x": -2425733.4027510183,
  //     "y": 5368517.919669004,
  //     "z": 2436785.1348079997
  //   },
  //   {
  //     "x": -2425734.247876029,
  //     "y": 5368522.618569243,
  //     "z": 2436772.724853033
  //   },
  //   {
  //     "x": -2425732.136287466,
  //     "y": 5368526.344892882,
  //     "z": 2436759.874492359
  //   },
  //   {
  //     "x": -2425727.639441614,
  //     "y": 5368530.108145583,
  //     "z": 2436747.487228473
  //   },
  //   {
  //     "x": -2425721.595262269,
  //     "y": 5368535.346053146,
  //     "z": 2436736.6486699423
  //   },
  //   {
  //     "x": -2425714.8375076987,
  //     "y": 5368543.338284062,
  //     "z": 2436728.345604704
  //   },
  //   {
  //     "x": -2425707.175653115,
  //     "y": 5368552.965928007,
  //     "z": 2436722.429989724
  //   },
  //   {
  //     "x": -2425697.996310816,
  //     "y": 5368562.06368826,
  //     "z": 2436718.225815935
  //   },
  //   {
  //     "x": -2425687.382133005,
  //     "y": 5368569.920761799,
  //     "z": 2436715.662350853
  //   },
  //   {
  //     "x": -2425675.7876207074,
  //     "y": 5368576.590523907,
  //     "z": 2436714.950969896
  //   },
  //   {
  //     "x": -2425663.690226217,
  //     "y": 5368582.147300058,
  //     "z": 2436716.2398579465
  //   },
  //   {
  //     "x": -2425651.5128324837,
  //     "y": 5368586.544645051,
  //     "z": 2436719.545781117
  //   },
  //   {
  //     "x": -2425639.6773648406,
  //     "y": 5368589.763847483,
  //     "z": 2436724.820791386
  //   },
  //   {
  //     "x": -2425628.5779443285,
  //     "y": 5368591.783454587,
  //     "z": 2436731.939498954
  //   },
  //   {
  //     "x": -2425618.569882187,
  //     "y": 5368592.582070171,
  //     "z": 2436740.703863507
  //   },
  //   {
  //     "x": -2425609.9912621784,
  //     "y": 5368592.2106669005,
  //     "z": 2436750.8819581363
  //   },
  //   {
  //     "x": -2425603.045614092,
  //     "y": 5368590.554094956,
  //     "z": 2436762.106746415
  //   },
  //   {
  //     "x": -2425597.917765244,
  //     "y": 5368587.604680027,
  //     "z": 2436774.010655858
  //   },
  //   {
  //     "x": -2425594.990041536,
  //     "y": 5368583.953405695,
  //     "z": 2436786.461090122
  //   },
  //   {
  //     "x": -2425594.226993916,
  //     "y": 5368579.435877992,
  //     "z": 2436798.953932635
  //   },
  //   {
  //     "x": -2425595.6308510234,
  //     "y": 5368574.142989663,
  //     "z": 2436811.0884061255
  //   },
  //   {
  //     "x": -2425599.6190900905,
  //     "y": 5368569.253982813,
  //     "z": 2436822.9611949893
  //   },
  //   {
  //     "x": -2425605.6917525553,
  //     "y": 5368564.079059818,
  //     "z": 2436833.828464858
  //   },
  //   {
  //     "x": -2425613.6235276163,
  //     "y": 5368558.685164345,
  //     "z": 2436843.3187631797
  //   },
  //   {
  //     "x": -2425622.6404243847,
  //     "y": 5368552.056538768,
  //     "z": 2436850.604671557
  //   },
  //   {
  //     "x": -2425631.6830420415,
  //     "y": 5368542.6562523525,
  //     "z": 2436854.6704370333
  //   },
  //   {
  //     "x": -2425641.1544039818,
  //     "y": 5368532.270058864,
  //     "z": 2436856.0780386524
  //   },
  //   {
  //     "x": -2425651.3087722273,
  //     "y": 5368522.413220585,
  //     "z": 2436855.3329362427
  //   },
  //   {
  //     "x": -2425662.2197623616,
  //     "y": 5368514.231002613,
  //     "z": 2436852.8442724817
  //   },
  //   {
  //     "x": -2425673.6240902,
  //     "y": 5368508.123016667,
  //     "z": 2436848.75667192
  //   },
  //   {
  //     "x": -2425685.103771441,
  //     "y": 5368504.11664108,
  //     "z": 2436843.122036258
  //   },
  //   {
  //     "x": -2425696.149171019,
  //     "y": 5368501.97763283,
  //     "z": 2436835.9488953035
  //   },
  //   {
  //     "x": -2425706.548391613,
  //     "y": 5368502.044763699,
  //     "z": 2436827.5803027824
  //   },
  //   {
  //     "x": -2425715.891330833,
  //     "y": 5368504.107664156,
  //     "z": 2436818.175322171
  //   },
  //   {
  //     "x": -2425723.8001491437,
  //     "y": 5368507.895709013,
  //     "z": 2436807.924683107
  //   },
  //   {
  //     "x": -2425729.658444095,
  //     "y": 5368512.461451178,
  //     "z": 2436796.7594818347
  //   },
  //   {
  //     "x": -2425733.4027510183,
  //     "y": 5368517.919669004,
  //     "z": 2436785.1348079997
  //   },
  // ]
  // 创建多边形几何体
  var polygon = new PolygonGeometry({
    polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(positions)),
    closeTop: true,
    closeBottom: false,
    extrudedHeight: 0,
    perPositionHeight: true
  });
  var material = new Material({
    fabric: {
      type: 'DiffuseMap',
      uniforms: {
        image: '/image/3DModel/1-2.png',
        repeat: new Cartesian2(1.0, 1.0)
      }
    }
  });
  var appearance = new MaterialAppearance({
    material: material,
    faceForward: true, // 确保材料始终朝向相机
    translucent: false // 根据需要设置材质是否半透明
  });
  // 创建Primitive
  var polygonPrimitive = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: polygon
    }),
    appearance: appearance,
    asynchronous: false // 设置为false，确保在继续之前完成加载
  });

  // 将Primitive添加到场景中
  // window.viewer.scene.primitives.add(polygonPrimitive);


  var sideGeometry = new WallGeometry({
    positions: Cartesian3.fromDegreesArrayHeights(positions),
    maximumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(200.0), // 侧面的高度
    minimumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(0.0) // 底部高度
  });
  var sideMaterial = new Material({
    fabric: {
      type: 'DiffuseMap',
      uniforms: {
        image: '/image/3DModel/1-2.png',
        repeat: new Cartesian2(4.0, 4.0)
      }
    }
  });
  var sideAppearance = new MaterialAppearance({
    material: sideMaterial,
    faceForward: true
  });
  var sideGeometryInstance = new GeometryInstance({
    geometry: sideGeometry
  });
  var sidePrimitive = new Primitive({
    geometryInstances: sideGeometryInstance,
    appearance: sideAppearance
  });
  window.viewer.scene.primitives.add(sidePrimitive);

  var topMaterial = new Material({
    fabric: {
      type: 'DiffuseMap',
      uniforms: {
        image: '/image/3DModel/1-2.png',
        repeat: new Cartesian2(2.0, 2.0)
      }
    }
  });
  var topAppearance = new MaterialAppearance({
    material: topMaterial,
    faceForward: true
  });
  var topGeometry = new PolygonGeometry({
    polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(positions)),
    perPositionHeight: true,
    // extrudedHeight:200,
  });
  var topGeometryInstance = new GeometryInstance({
    geometry: topGeometry
  });
  var topPrimitive = new Primitive({
    geometryInstances: topGeometryInstance,
    appearance: topAppearance
  });
  // window.viewer.scene.primitives.add(topPrimitive);

}
// export function loadDrill() {
//   let drillAll = []
//   for (const key in drillData) {
//     let center = [drillData[key].jd, drillData[key].wd]
//     // console.log('name：drillData[key]', drillData[key]);
//     var radius = 0.0005;
//     let drillListData = drillData[key].xq;
//     drillAll = [...drillData[key].xq,...drillAll]
//     var options = { steps: 36, units: "kilometers", properties: { } };
//     let circle = turf.circle(center, radius, options)
//     let coordinates = circle.geometry.coordinates[0];
//     let positions = [];
//     coordinates.forEach(e=>{
//       positions.push(e[0],e[1],0)
//     })
//     drillListData.forEach(e => {
//       var height = e.cdgc / 1;
//       var extrudedHeight = (e.cdgc + e.tchd) / 1;
//       loadWallGeometry(positions,height,extrudedHeight,e.dcbh,e.tchd)
//     });
//   }
//   console.log('name：drillAll',drillAll);


// }
export function loadDrill() {
  let drillAll = [],drillGroup=[]
  for (const key in drillData) {
    let drillListData = drillData[key].xq;
    drillListData.forEach(e => {
      e.jd = drillData[key].jd;
      e.wd = drillData[key].wd;
      drillAll.push(e)
    });
   
  }
  drillGroup = groupByField(drillAll,'dcbh')
  console.log('name：drillGroup',drillGroup);
  drillGroup.forEach(e=>{
    let instances=[],heightData=[];
    e.forEach(child => {
    // console.log('name：child',child);
      var radius = 0.0005;
      let center = [child.jd, child.wd];
      var options = { steps: 36, units: "kilometers", properties: { } };
      let circle = turf.circle(center, radius, options);
      let coordinates = circle.geometry.coordinates[0];
      let positions = [];
      coordinates.forEach(_coord=>{
        positions.push(_coord[0],_coord[1],0)
      })
      var height = child.cdgc / 1;
      var extrudedHeight = (child.cdgc + child.tchd) / 1;
      heightData.push(child.tchd * 1)
      var sideGeometry = createWallGeometry(positions,height,extrudedHeight);
      var sideGeometryInstance = new GeometryInstance({
        geometry: sideGeometry
      });
      instances.push(sideGeometryInstance)
    });
    let h = Math.max(...heightData) - Math.min(...heightData)
    var sideAppearance = createAppearence(e[0].dcbh,h);
    var sidePrimitive = new Primitive({
      geometryInstances: instances,
      appearance: sideAppearance
    });
    window.viewer.scene.primitives.add(sidePrimitive);
  })
}
/**
 * 将数组中相同值的归为一个数组
 * @param array 数据
 * @param fieldName 根据什么字段名称来判断
 * @returns 
 */
export function groupByField(array, fieldName) {
  return array.reduce((acc, obj) => {
    const fieldValue = obj[fieldName];
    const group = acc.find(group => group[0][fieldName] === fieldValue);
    if (group) {
      group.push(obj);
    } else {
      acc.push([obj]);
    }
    return acc;
  }, []);
}
function createWallGeometry(positions,minimumHeights,maximumHeights){
  return new WallGeometry({
    positions: Cartesian3.fromDegreesArrayHeights(positions),
    maximumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(maximumHeights), // 侧面的高度
    minimumHeights: new Array(Cartesian3.fromDegreesArrayHeights(positions).length).fill(minimumHeights) // 底部高度
  });
}
function createAppearence(dcbh,height){
  const repeatY = Math.ceil(height / 10);
  return new MaterialAppearance({
    material: new Material({
      fabric: {
        type: 'DiffuseMap',
        uniforms: {
          image: `http://127.0.0.1:8081/${dcbh}.png`,
          repeat: new Cartesian2(1,repeatY)
        },
      }
    }),
    faceForward: true
  });
}
export function loadWallGeometry(positions,minimumHeights,maximumHeights,dcbh,tchd) {
  var sideGeometry = createWallGeometry(positions,minimumHeights,maximumHeights);
  var sideAppearance = createAppearence(dcbh,tchd);
  var sideGeometryInstance = new GeometryInstance({
    geometry: sideGeometry
  });
  var sidePrimitive = new Primitive({
    geometryInstances: sideGeometryInstance,
    appearance: sideAppearance
  });
  window.viewer.scene.primitives.add(sidePrimitive);
}
