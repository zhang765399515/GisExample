import {
  buildModuleUrl,
  CMath,
  Color,
  Cartesian3,
  Cartographic,
  CallbackProperty,
  Entity,
  RealWaterMaterialProperty,
  defined,
  EventDriven,
  HeightReference,
  PolygonHierarchy,
  Geokey3DTileset,
  GeokeyTerrainProvider,
  ScreenSpaceEventHandler,
  sampleTerrainMostDetailed
} from "geokey-gis";

const pointHeightArr: number[] = [];
const activeShapePoints: Cartesian3[] = [];
const cartographics: Cartographic[] = [];
let cartographicTerrainObj: Cartographic[] = [];
let handleExection: (clock: any) => void;
let activeShape: any;
let waterPolygon: Entity;
let waterLevel: number;
let floatingPoint: any;
let polygonEventDrive: ScreenSpaceEventHandler;
let polygonMouseMove: ScreenSpaceEventHandler;
let polygonRightClick: ScreenSpaceEventHandler;
let state = {
  waterHeight: 900, //初始水位
  targetHeight: 1000, //目标水位
  speed: 0.1, //淹没的速度
  cartographicObj: []
};

const realWaterMaterial = new RealWaterMaterialProperty({
  normalMap: buildModuleUrl('Assets/Textures/waterNormals.jpg'),
  frequency: 2000,
  animationSpeed: 1.0,
  amplitude: 10.0,
  specularIntensity: 10.0,
  baseWaterColor: Color.fromCssColorString('rgba(23, 109, 194, 0.9)'),
  blendColor: Color.fromCssColorString('rgba(255, 255, 255, 1)')
});

export async function createInundationScene() {
  try {
    const tileset = await Geokey3DTileset.fromUrl('http://139.9.106.119:12022/service/gis/3DModel/?serviceName=guangdong_xiaoqu_b3dm', {
      maximumScreenSpaceError: 2,
      lightColor: new Cartesian3(10, 10, 10)
    });
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
  } catch {
    console.error('加载倾斜摄影数据错误');
  }
  const elevationLayer = await GeokeyTerrainProvider.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=hc_nanchang_dem_yuan');
  window.viewer.terrainProvider = elevationLayer;
}

/**
 * 绘制淹没范围
 */
export function drawInundationRange() {
  window.viewer.scene.globe.depthTestAgainstTerrain = true;

  const polygonEventDriven = new EventDriven(window.viewer);

  polygonEventDriven.addEvent('left_click', (ment: any) => {
    let clickLocation = Cartesian3.fromDegrees(ment.mapPoint.longitude, ment.mapPoint.latitude, ment.mapPoint.height);
    pointHeightArr.push(ment.mapPoint.height);
    if (clickLocation) {
      if (activeShapePoints.length === 0) {
        activeShapePoints.push(clickLocation);
      }
      activeShapePoints.push(clickLocation);
      if (!defined(floatingPoint)) {
        floatingPoint = actionPoint(activeShapePoints);
      }
      if (!defined(activeShape)) {
        activeShape = window.viewer.entities.add({
          name: 'polygon',
          polygon: {
            hierarchy: new CallbackProperty(() => {
              return new PolygonHierarchy(activeShapePoints);
            }, false),
            material: Color.fromAlpha(Color.fromCssColorString('#00BFFF'), 0.3),
            perPositionHeight: false
          }
        });
      }
    }
  });
  polygonEventDriven.addEvent('mouse_move', (e: any) => {
    if (defined(floatingPoint)) {
      let newPosition = Cartesian3.fromDegrees(e.mapPoint.longitude, e.mapPoint.latitude, e.mapPoint.height);
      if (defined(newPosition)) {
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  });
  polygonEventDriven.addEvent('right_click', (r: any) => {
    let minHeight = Math.min(...pointHeightArr);
    let maxHeight = Math.max(...pointHeightArr);
    state.waterHeight = minHeight - 10;
    state.targetHeight = maxHeight;
    if (defined(floatingPoint)) {
      window.viewer.entities.remove(floatingPoint);
    }
    floatingPoint = undefined;
    polygonEventDrive && !polygonEventDrive.isDestroyed() && polygonEventDrive.destroy();
    polygonMouseMove && !polygonMouseMove.isDestroyed() && polygonMouseMove.destroy();
  });
}

/**
 * 淹没开始
 */
export function inundationStart() {
  const inundationEntities = window.viewer.entities.values;
  let length = inundationEntities.length;
  for (let i = length - 1; i >= 0; i--) {
    if (inundationEntities[i].name == 'polygon') {
      window.viewer.entities.remove(inundationEntities[i]);
    }
  }
  if (state.speed == 0) {
    state.speed = 0.1;
  }
  if (activeShapePoints.length) {
    waterPolygon = window.viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(activeShapePoints),
        extrudedHeight: new CallbackProperty(() => {
          if (state.waterHeight < state.targetHeight) {
            state.waterHeight += state.speed;
          }
          return state.waterHeight;
        }, false),
        material: realWaterMaterial,
        perPositionHeight: true
      }
    });

    // //获取到地质信息
    getTerrainHeights(activeShapePoints);

    // //渲染前监听
    rotateMapFn();

    activeShape = undefined;
  }
}

export function inundationStop() {
  state.speed = 0;
}

function rotateMapFn() {
  handleExection = clock => {
    let currentTime = clock.currentTime;
    state.cartographicObj = [];
    //回去到当前数位的高度
    let extrudedHeight = (waterPolygon as any).polygon.extrudedHeight.getValue(currentTime);
    //计算出每个插值点的水位
    if (cartographicTerrainObj && extrudedHeight < state.targetHeight) {
      //过滤出水位大于0的位置
      cartographicTerrainObj.filter(cartographic => {
        if (cartographic) {
          const waterLevel = extrudedHeight - cartographic.height;
          return waterLevel > 0;
        }
      });
      //计算出每个位置的实时水位
      cartographicTerrainObj.map(cartographic => {
        let waterLevel = extrudedHeight - cartographic.height;
        let x = CMath.toDegrees(cartographic.longitude);
        let y = CMath.toDegrees(cartographic.latitude);
        let obj = { waterLevel: waterLevel, x: x, y: y };
      });
    }
  };
  window.viewer.clock.onTick.addEventListener(handleExection);
}

function getTerrainHeights(cartesians: Cartesian3[]) {
  // 根据地形插值计算某经纬度点的高度
  let count = 20;
  for (let i = 1; i < count; i++) {
    let lerp = Cartesian3.lerp(cartesians[0], cartesians[cartesians.length - 1], i / count, new Cartesian3());
    cartographics.push(Cartographic.fromCartesian(lerp));
  }
  //从地质接口采样取出地质数据，也就是地质数据的采样
  let promise = sampleTerrainMostDetailed(window.viewer.terrainProvider, cartographics);
  Promise.resolve(promise).then(function (updatedPositions) {
    cartographicTerrainObj = updatedPositions;
    return cartographicTerrainObj;
  });
}

function actionPoint(activePoint: Cartesian3[]) {
  const entitiesPoint = window.viewer.entities.add({
    //位置回调取鼠标移动的最后一个点
    position: activePoint[activePoint.length - 1],
    point: {
      pixelSize: 5,
      color: Color.RED.withAlpha(0.8),
      outlineColor: Color.WHITE,
      outlineWidth: 1,
      heightReference: HeightReference.CLAMP_TO_GROUND
    }
  });
  return entitiesPoint;
}

export function removeInundationRange() {
  window.viewer.scene.globe.depthTestAgainstTerrain = false;
  window.viewer.clock.onTick.removeEventListener(handleExection);
  window.viewer.entities.removeAll();
  activeShapePoints.length = 0;
  activeShape = undefined;
  state = {
    waterHeight: 10, //初始水位
    targetHeight: 1000, //目标水位
    speed: 0.01, //淹没的速度
    cartographicObj: []
  };
}
