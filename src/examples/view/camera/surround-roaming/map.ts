import { JulianDate, Cartesian3, CMath, ClockStep, ClockRange, Geokey3DTileset } from "geokey-gis";

let exection: () => void;

export async function loadTilesLayer() {
  const tileset = await new Geokey3DTileset({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=xms_3dtile',
    maximumScreenSpaceError: 0.5
  }).readyPromise;
  window.viewer.scene.primitives.add(tileset);
  window.viewer.zoomTo(tileset);
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
