import {
  Color,
  CMath,
  Cartesian3,
  Cartographic,
  GroundPrimitive,
  GeometryInstance,
  EllipseGeometry,
  ColorGeometryInstanceAttribute,
  sampleTerrainMostDetailed,
  HeightReference,
  WebMercatorProjection,
  CallbackProperty,
  PolylineGlowMaterialProperty,
  Transforms,
  Matrix4,
  HorizontalOrigin,
  VerticalOrigin,
  PickGlobe,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from "geokey-gis";

const exampleArr: any[] = [
  { x: -2403297.8045861954, y: 5380741.804111674, z: 2431575.8444538233 },
  { x: -2404035.1721221646, y: 5380414.8887628475, z: 2431570.38094525 },
  { x: -2404139.3739980133, y: 5380648.063005697, z: 2430955.4597257758 }
  // { x: -2403430.7011627587, y: 5380995.46660499, z: 2430887.6985820737 }
];

export function regularInterpolation(
  points: Array<
    | Cartesian3
    | Cartographic
    | {
        longitude: number;
        latitude: number;
        height: number;
      }
  >,
  spacing: number
) {
  const viewer = window.viewer;
  const pickPosition = new PickGlobe(viewer);
  const labelCollect: Cartesian3[] = [];
  const lerpArray: Cartographic[] = []; // 插值的数组
  const divisiblePoint: Cartesian3[] = [];

  let totalNumber: number = 0;
  let remainder: number = 0;
  let startPoint: number = 0;

  for (let i = 0; i < exampleArr.length - 1; i++) {
    const j = (i + 1) % exampleArr.length;
    drawVectorLine(exampleArr[i], exampleArr[j]);
    getTerrainDisdance(exampleArr[i], exampleArr[j]);
  }

  for (let i = 0; i < lerpArray.length - 1; i++) {
    const j = (i + 1) % lerpArray.length;
    let lerpArrayi = Cartesian3.fromRadians(lerpArray[i].longitude, lerpArray[i].latitude, lerpArray[i].height);
    let lerpArrayj = Cartesian3.fromRadians(lerpArray[j].longitude, lerpArray[j].latitude, lerpArray[j].height);
  }

  function getTerrainDisdance(start: Cartesian3, end: Cartesian3, split: number = 200) {
    const splitNumber = parseInt(Cartesian3.distance(start, end).toFixed(2));
    totalNumber += splitNumber;
    let midpoint = Cartesian3.add(start, end, new Cartesian3());
    let currentDistance = 0;
    midpoint = Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

    const direction = getHeading(midpoint, end);

    let startCartographic: Cartographic = Cartographic.fromCartesian(start),
      endCartographic: Cartographic = Cartographic.fromCartesian(end);
    let initialPoint = null;
    let finalPoint = null;

    if (startPoint !== 0) {
      initialPoint = calculatingTargetPoints(start, direction, startPoint);
      initialPoint ? (startCartographic = Cartographic.fromCartesian(initialPoint)) : '';
      // 减去起始点后余下的长度
      remainder = (splitNumber - startPoint) % split;
    } else {
      // 求得每一段余下的长度
      remainder = (splitNumber - remainder) % split;
    }
    // 计算第二段的起始点距第二个点的长度
    startPoint = split - remainder;
    // 得到后一个点
    finalPoint = calculatingTargetPoints(end, direction, remainder, Color.BLUE);

    let startDegrees = [startCartographic.longitude, startCartographic.latitude],
      endDegrees = [endCartographic.longitude, endCartographic.latitude];

    const splitNum = Math.trunc(splitNumber / split);
    // lerpArray.push(new Cartographic(startDegrees[0], startDegrees[1]));
    while (currentDistance + split < splitNumber) {
      for (let i = 0; i <= splitNum; i++) {
        let p = (currentDistance + split) / totalNumber;
        let x = CMath.lerp(startDegrees[0], endDegrees[0], p);
        let y = CMath.lerp(startDegrees[1], endDegrees[1], p);
        drawPoints(Cartesian3.fromRadians(x, y, 0));
        lerpArray.push(new Cartographic(x, y));
        currentDistance += split;
      }
    }
    currentDistance -= splitNumber;
  }

  function calculatingTargetPoints(point: Cartesian3, direction: number, radius: number, color: Color = Color.RED) {
    // 世界坐标转换为投影坐标
    const webMercatorProjection = new WebMercatorProjection(viewer.scene.globe.ellipsoid);
    const viewPointWebMercator = webMercatorProjection.project(Cartographic.fromCartesian(point));
    // 计算目标点
    let toPoint = new Cartesian3(viewPointWebMercator.x + radius * Math.cos(direction), viewPointWebMercator.y + radius * Math.sin(direction), 0);
    // 投影坐标转世界坐标
    let interpolation = webMercatorProjection.unproject(toPoint);
    let cart = Cartographic.toCartesian(interpolation.clone());
    return cart;
  }

  function getHeading(pointA: Cartesian3, pointB: Cartesian3) {
    //建立以点A为原点，X轴为east,Y轴为north,Z轴朝上的坐标系
    const transform = Transforms.eastNorthUpToFixedFrame(pointA);
    //向量AB
    const positionvector = Cartesian3.subtract(pointB, pointA, new Cartesian3());
    //因transform是将A为原点的eastNorthUp坐标系中的点转换到世界坐标系的矩阵
    //AB为世界坐标中的向量
    //因此将AB向量转换为A原点坐标系中的向量，需乘以transform的逆矩阵。
    const vector = Matrix4.multiplyByPointAsVector(Matrix4.inverse(transform, new Matrix4()), positionvector, new Cartesian3());
    //归一化
    const direction = Cartesian3.normalize(vector, new Cartesian3());
    //heading
    const heading = Math.atan2(direction.x, direction.y) + CMath.PI_OVER_TWO;
    return heading;
  }

  function drawPoints(position: Cartesian3, color: Color = Color.KHAKI, size: number = 10) {
    viewer.entities.add({
      name: 'line',
      position: position,
      point: {
        color: color,
        pixelSize: size
      }
    });
  }

  function drawVectorLine(start: Cartesian3, end: Cartesian3, ground = true) {
    const lineMaterial = new PolylineGlowMaterialProperty({
      glowPower: 0.5,
      color: Color.fromCssColorString('#0ff')
    });
    return viewer.entities.add({
      name: 'line',
      polyline: {
        positions: new CallbackProperty(() => {
          return [start, end];
        }, false),
        width: 5.0,
        material: lineMaterial,
        depthFailMaterial: lineMaterial,
        clampToGround: ground
      }
    });
  }

  function getDetailedTerrainDistance(cartographicArr: Cartographic[]) {
    return new Promise(resolve => {
      let terrainDistance = 0;
      cartographicArr.map((currentCartographic, index) => {
        if (index == cartographicArr.length - 1) {
          return;
        }
        let nextCartographic = cartographicArr[index + 1];
        let currentPosition = Cartesian3.fromRadians(currentCartographic.longitude, currentCartographic.latitude, currentCartographic.height);
        let nextPosition = Cartesian3.fromRadians(nextCartographic.longitude, nextCartographic.latitude, nextCartographic.height);
        terrainDistance += Cartesian3.distance(currentPosition, nextPosition);
      });
      resolve(terrainDistance);
    });
  }
}
