import { SceneTransforms, JulianDate, Cartesian3, CMath, ClockStep, ClockRange, Geokey3DTileset, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartographic, Ray, PolylineDashMaterialProperty, Color, SampledPositionProperty, VelocityOrientationProperty, TimeIntervalCollection, TimeInterval, Matrix4, Matrix3, Cartesian2, defined, Geokey3DTileFeature } from "geokey-gis";
import { along, length, lineString } from "@turf/turf";
import { first } from "lodash";
let exection: () => void;
let tileset;
export async function loadTilesLayer() {
  if (tileset) {
    tileset.show=true;
    return
  }
  try {
    tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/Scene/Production_2.json?uuid=633463e9-97e2-47e1-86f6-85edb862c4cd&serviceName=sz_hsl_b3dm20231109', {
      maximumScreenSpaceError: 2,
      lightColor: new Cartesian3(10, 10, 10)
    });
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
  } catch {
    console.log("加载3DTile失败");
  }
}
export function removeTilesLayer() {
  tileset.show=false
}
export async function startToRoaming() {
  const options: any = {
    lng: 114.49634,
    lat: 22.652898,
    height: 0,
    heading: 0.0,
    pitch: 0.0,
    roll: 0.0
  };

  const position = Cartesian3.fromDegrees(options.lng, options.lat, options.height);
  // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
  const pitch = CMath.toRadians(-30);
  // 给定飞行一周所需时间，比如转动30s, 那么每秒转动度数
  const angle = 360 / 30;
  // 给定相机距离点多少距离飞行，这里取值为5000m
  const distance = 1000;
  const startTime = JulianDate.fromDate(new Date());
  const stopTime = JulianDate.addSeconds(startTime, 10, new JulianDate()); // 不设置结束时间，则会一直转动

  window.viewer.clock.startTime = startTime.clone(); // 开始时间
  //window.viewer.clock.stopTime = stopTime.clone(); // 结束时间
  window.viewer.clock.currentTime = startTime.clone(); // 当前时间
  window.viewer.clock.clockRange = ClockRange.CLAMPED; // 行为方式
  window.viewer.clock.clockStep = ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
  // 相机的当前heading
  const initialHeading = window.viewer.camera.heading;
  /**
   * 绕点飞行
   */
  exection = () => {
    // 当前已经过去的时间，单位s
    const delTime = JulianDate.secondsDifference(window.viewer.clock.currentTime, window.viewer.clock.startTime);
    const heading = CMath.toRadians(delTime * angle) + initialHeading;
    window.viewer.scene.camera.setView({
      destination: position, // 点的坐标
      orientation: {
        heading: heading,
        pitch: pitch
      }
    });
    window.viewer.scene.camera.moveBackward(distance);

    if (JulianDate.compare(window.viewer.clock.currentTime, window.viewer.clock.stopTime) >= 0) {
      window.viewer.clock.onTick.removeEventListener(exection);
    }
  };
  window.viewer.clock.onTick.addEventListener(exection);
}

/**
 * 关闭漫游效果
 */
export function stopToRoaming() {
  if (exection) {
    window.viewer.clock.onTick.removeEventListener(exection);
  }
}
export function startDrawPath() {

}
export class roamCollision {
  handler: any;
  points: any[];
  line: any;
  startTime;
  stopTime;
  roamEntity;
  listener;
  constructor() {
    this.points = [];
  }
  startDrawPath(callback) {

    this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    this.handler.setInputAction(evt => {
      //获取笛卡尔数据
      var cartesian = window.viewer.scene.pickPosition(evt.position);
      //分析经纬度数据
      let point = this.getCatesian3To84(cartesian);
      this.points.push(point)
      callback(point)
    }, ScreenSpaceEventType.LEFT_CLICK);
  }
  analyzeCollision(val, callback) {

    let TwoPoint = this.getRayByTwoPoint(
      Cartesian3.fromDegrees(val[0].longitude, val[0].latitude, val[0].height),
      Cartesian3.fromDegrees(val[1].longitude, val[1].latitude, val[1].height)
    );

    let drillingData = window.viewer.scene.drillPickFromRay(TwoPoint, Number.MAX_VALUE, [], 0.1);
    this.loadCollisionLine(drillingData);


    // const collisions = this.checkObliquePhotographyCollision(Cartesian3.fromDegrees(val[0].longitude, val[0].latitude, val[0].height), Cartesian3.fromDegrees(val[1].longitude, val[1].latitude, val[1].height));
    // console.log('name：collisions', collisions);

    let points = [];
    val.forEach(e => {
      points.push([e.longitude, e.latitude])

    })
    const line = lineString(points);
    const pointCount = 50; // 采样点数量
    const sampledPoints = [];
    for (let i = 0; i <= pointCount; i++) {
      // 使用turf.along在路径上按比例获取点
      const distance = length(line) * (i / pointCount);
      const point = along(line, distance, { units: 'kilometers' });
      sampledPoints.push(point.geometry.coordinates);
    }
    let lonLatHeight = [];
    sampledPoints.forEach(e => {
      lonLatHeight.push(this.getPointHeight(e));
    })
    callback(lonLatHeight)
  }
  checkObliquePhotographyCollision(pointA, pointB) {
    // 创建从点A到点B的射线
    const direction = Cartesian3.subtract(pointB, pointA, new Cartesian3());
    const ray = new Ray(pointA, Cartesian3.normalize(direction, direction));

    // 计算两点之间的距离
    const maxDistance = Cartesian3.distance(pointA, pointB);

    // 存储所有碰撞结果
    const results = [];

    // 遍历场景中的所有3D Tileset（倾斜摄影模型）
    viewer.scene.primitives._primitives.forEach(primitive => {
      // 对每个3D Tileset进行射线检测
      let pickResult = {};
      const pickResult1 = primitive.pick(ray, pickResult);

      console.log('name：pickResult', pickResult, pickResult);
      if (pickResult1) {
        // 计算交点到起点的距离
        const intersectionDistance = Cartesian3.distance(
          pointA,
          pickResult.position
        );

        // 检查交点是否在两点之间的线段上
        results.push({
          position: pickResult.position,
          tileset: primitive,
          distance: intersectionDistance,
          feature: pickResult.feature // 被击中的具体要素
        });
      }
    });

    console.log('name：results', results);
    // 按距离排序（近→远）
    results.sort((a, b) => a.distance - b.distance);

    return results;
  }
  loadCollisionLine(val) {
    console.log('name：val', val);
    val.forEach((e, i) => {
      window.viewer.entities.add({
        position: e.position,
        point: {
          color: Color.fromCssColorString(`rgba(255,${i},${i},1)`),
          pixelSize: 15,
        }
      })
    });
  }
  getPointHeight(val) {
    let TwoPoint = this.getRayByTwoPoint(
      Cartesian3.fromDegrees(val[0], val[1], 1000),
      Cartesian3.fromDegrees(val[0], val[1], - 1000)
    );
    let drillingData = this.drillPickFromRay(TwoPoint, Number.MAX_VALUE, [], 0.1);
    if (drillingData[0]) {
      let firstPoint = this.getCatesian3To84(drillingData[0].position);
      return firstPoint
    }
    return {}
  }
  getCatesian3To84(cartesian) {
    var cartographicPosition = Cartographic.fromCartesian(cartesian);
    var longitude = CMath.toDegrees(cartographicPosition.longitude);
    var latitude = CMath.toDegrees(cartographicPosition.latitude);
    var height = cartographicPosition.height;
    return { longitude: + longitude.toFixed(6), latitude: + latitude.toFixed(6), height: + height.toFixed(6) }
  }
  getRayByTwoPoint(positionA, positionB) {
    let result = new Cartesian3();
    let direction = Cartesian3.normalize(Cartesian3.subtract(positionB, positionA, result), result);
    return new Ray(positionA, direction);
  }
  drillPickFromRay(ray, limit, objectsToExclude, width) {
    return window.viewer.scene.drillPickFromRay(ray, limit, objectsToExclude, width);
  }
  loadLine(data) {
    let points = [];
    data.forEach(e => {
      points.push(e.longitude, e.latitude, e.height)
    })
    if (this.line) {
      this.line.polyline.positions = Cartesian3.fromDegreesArrayHeights(points)
      return
    }
    let polyline = {
      positions: Cartesian3.fromDegreesArrayHeights(points),
      material: new PolylineDashMaterialProperty({
        color: Color.fromCssColorString("#ff0000"),
        dashLength: 0,//虚线长度
      }),
      disableDepthTestDistance: 50000000,
      width: 2,
      clampToGround: true
    };
    this.line = window.viewer.entities.add({
      polyline: polyline,
    });
  }
  changeFit() {
    if (this.line) {
      this.line.polyline.clampToGround = !this.line.polyline.clampToGround
      return
    }
  }
  startRoam(data) {
    const positions = this.processData(data);
    let lineString = [];
    data.forEach((e) => {
      lineString.push([e.longitude, e.latitude, e.height2 - e.height]);
    });
    let positionProperty_1 = this.computePath(positions);
    this.roamEntity = window.viewer.entities.add({

      position: positionProperty_1,
      orientation: new VelocityOrientationProperty(positionProperty_1), // 根据所提供的速度计算模型的朝向
      availability: new TimeIntervalCollection([new TimeInterval({ // 和时间轴关联
        start: this.startTime,
        stop: this.stopTime
      })]),
      model: {
        uri: 'src/assets/model/无人机.glb',
        scale: 0.01
      }
    });
    window.viewer.trackedEntity = this.roamEntity;
    this.startFly()
    // this.lookAtTransform();
  }
  processData(data) {
    const coordinates = [];
    data.forEach(e => {
      const car3Position = Cartesian3.fromDegrees(e.longitude, e.latitude, e.height)
      coordinates.push(car3Position)
    })
    return coordinates;
  }
  computePath(positions) {
    // 起始时间
    this.startTime = JulianDate.now();
    // 结束时间
    this.stopTime = JulianDate.addSeconds(this.startTime, 360, new JulianDate());
    // 设置时钟开始时间
    if (window.viewer && window.viewer.clock) {
      window.viewer.clock.startTime = this.startTime.clone();
      // 设置始终停止时间
      window.viewer.clock.stopTime = this.stopTime.clone();
      // 设置时钟当前时间
      window.viewer.clock.currentTime = this.startTime.clone();
      //循环执行,即为2，到达终止时间，重新从起点时间开始
      window.viewer.clock.clockRange = ClockRange.CLAMPED;
    }

    //按照时间进行位置取样，返回一个位置取样的属性
    let property = new SampledPositionProperty();
    for (let j = 0; j < positions.length; j++) {
      let time = JulianDate.addSeconds(this.startTime, j * 60, new JulianDate());
      let position = positions[j];
      property.addSample(time, position);
    }
    console.log('name：property', property);
    return property;
  }
  startFly() {
    window.viewer.clock.multiplier = 1;
    window.viewer.clock.shouldAnimate = true;
    // window.viewer.scene.globe.show=false;
  }
  lookAtTransform() {
    this.listener = e => {
      if (window.viewer.clock.shouldAnimate === true) {
        let ori = this.roamEntity.orientation.getValue(window.viewer.clock.currentTime); //获取偏向角
        console.log('name：ori', ori);
        let center = this.roamEntity.position.getValue(window.viewer.clock.currentTime); //获取位置
        if (ori != undefined) {
          let transform = Matrix4.fromRotationTranslation(Matrix3.fromQuaternion(ori), center); //将偏向角转为3*3矩阵，利用实时点位转为4*4矩阵
          if (ori && center) {
            window.viewer.camera.lookAtTransform(transform, new Cartesian3(-5, 0, 3.2));
          } else {
            window.viewer.camera.lookAtTransform(Matrix4.IDENTITY); // 或设置一个默认的视角
          }
          window.viewer.camera.lookAtTransform(transform, new Cartesian3(-5, 0, 3.2)); //将相机向后面放一点

        } else {
          // 重启鹰眼图关联
          window.viewer.clock.shouldAnimate = false;

          window.viewer.clock.onTick.removeEventListener(this.listener);
          this.listener = undefined;
        }
      }
    }
    window.viewer.clock.onTick.addEventListener(this.listener);

  }
}
