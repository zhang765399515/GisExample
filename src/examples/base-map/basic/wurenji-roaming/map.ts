import { JulianDate, Cartesian3, CMath, ClockStep, ClockRange, Geokey3DTileset, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartographic, Ray, PolylineDashMaterialProperty, Color, SampledPositionProperty, VelocityOrientationProperty, TimeIntervalCollection, TimeInterval } from "geokey-gis";

let exection: () => void;

export async function loadTilesLayer() {
  try {
    const tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=xms_3dtile', {
      maximumScreenSpaceError: 2,
      lightColor: new Cartesian3(10, 10, 10)
    });
    window.viewer.scene.primitives.add(tileset);
    window.viewer.zoomTo(tileset);
  } catch {
    console.log("加载3DTile失败");
  }
}

export async function startToRoaming() {
  const options: any = {
    lng: 114.3223291616,
    lat: 22.6045831633,
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
      console.log('name：point', point);
      this.points.push(point)
      callback(point)
    }, ScreenSpaceEventType.LEFT_CLICK);
  }
  analyzeCollision(val) {

    let TwoPoint = this.getRayByTwoPoint(
      Cartesian3.fromDegrees(val[0].longitude, val[0].latitude, val[0].height),
      Cartesian3.fromDegrees(val[1].longitude, val[1].latitude, val[1].height)
    );

    let drillingData = this.drillPickFromRay(TwoPoint, Number.MAX_VALUE, [], 0.1);
    console.log('name：drillingData', drillingData);
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
      width: 5,
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
    window.viewer.entities.add({
      position: positionProperty_1,
      orientation: new VelocityOrientationProperty(positionProperty_1), // 根据所提供的速度计算模型的朝向
      availability: new TimeIntervalCollection([new TimeInterval({ // 和时间轴关联
        start: this.startTime,
        stop: this.stopTime
      })]),
      model: {
        uri: 'src/assets/model/无人机.glb',
        scale: 0.01
      },
      show: false
    });
    console.log(1)
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
    if(window.viewer && window.viewer.clock){
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
    console.log('name：property',property);
    return property;
}
}
