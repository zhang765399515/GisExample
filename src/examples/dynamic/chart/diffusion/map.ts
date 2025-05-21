import { CMath, Cartographic, Color, Cartesian3, circleScanPostStage } from "geokey-gis";

const centerOne = [113.86274465535791, 22.530425668023707];
const centerTwo = [113.86074465535791, 22.530425668023707];
/**
 * 绘制扫描发光效果
 *
 * circleScanPostStage(
 *  viewer 视图实例
 *  cartographicCenter 扫描中心
 *  radius  半径 米
 *  scanColor 扫描颜色
 *  duration 持续时间 毫秒
 * )
 */
export function loadPhotoeffectScan() {
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  const cartographicCenterOne = new Cartographic(CMath.toRadians(centerOne[0]), CMath.toRadians(centerOne[1]), 3000);
  const cartographicCenterTwo = new Cartographic(CMath.toRadians(centerTwo[0]), CMath.toRadians(centerTwo[1]), 2);
  const scanColorOne = Color.BLUE;
  const scanColorTwo = Color.YELLOW;

  circleScanPostStage(window.viewer, cartographicCenterOne, 100, scanColorOne, 4000);
  circleScanPostStage(window.viewer, cartographicCenterTwo, 200, scanColorTwo, 3000);

  window.viewer.camera.flyTo({
    destination: Cartographic.toCartesian(cartographicCenterOne) //new Cartesian3(-2390191.037250918, 5385372.813908718, 2443749.1785916043),
  });
}
