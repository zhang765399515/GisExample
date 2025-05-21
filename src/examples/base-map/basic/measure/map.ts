import {
  GeokeyTerrainProvider,
  MeasureTools
} from "geokey-gis";

let tools:any;
export function widgetsTools() {
  window.viewer.scene.requestRenderMode = false
  window.viewer.scene.globe.depthTestAgainstTerrain = true
  var provider0 = new GeokeyTerrainProvider({
      url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_dem'
  })
  window.viewer.terrainProvider = provider0;
  tools = new MeasureTools(window.viewer);
}
export function pointTool() {
  tools.measurePoint();
}
export function clearPoint() {
  tools.clearPoint();
}
export function measureDistance() {
  tools.measureDistance();
}
export function clearDistance() {
  tools.clearDistance();
}
export function measureArea() {
  tools.measureArea();
}
export function clearArea() {
  tools.clearArea();
}
export function measureHeight() {
  tools.measureHeight();
}
export function clearHeight() {
  tools.clearHeight();
}
