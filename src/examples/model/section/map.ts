import {
  Plane,
  Color,
  CMath,
  Cartesian3,
  CallbackProperty,
  ConstantProperty,
  Entity,
  EllipsoidGeodesic,
  Graphic,
  GeoGraphicsLayer,
  HeightReference,
  JulianDate,
  PolygonGraphics,
  PolygonHierarchy,
  PolylineDashMaterialProperty,
  SimpleFillSymbol,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  Ray,
  Rectangle,
  ClippingPlane,
  ClippingPlaneCollection
} from "geokey-gis";

let handler: any = null,
  pointArray: Array<any> = [];
export function startDraw() {
  console.log('开始绘制');
  handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  //鼠标点击事件
  handler.setInputAction((event: any) => {
    let ray: Ray = window.viewer.camera.getPickRay(event.position) as Ray;
    let cartesian = window.viewer?.scene.globe.pick(ray, window.viewer.scene);
    pointArray.push(cartesian);
    console.log(cartesian);
  }, ScreenSpaceEventType.LEFT_CLICK);
}
export function section() {
  console.log('裁剪');
  let clippingPlanes = [];
  let positionsLength = pointArray.length;
  for (let i = 0; i < positionsLength; i++) {
    let nextIndex = (i + 1) % positionsLength;
    //计算两个点之间的中点
    let midpoint = Cartesian3.add(pointArray[i], pointArray[nextIndex], new Cartesian3());
    midpoint = Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
    //中点位置的上方向
    let up = Cartesian3.normalize(midpoint, new Cartesian3());
    //计算右方向
    let right = Cartesian3.subtract(pointArray[nextIndex], midpoint, new Cartesian3());
    right = Cartesian3.normalize(right, right);
    //上方向与右方向求叉积，叉积是与右方向与上方向是垂直的
    let normal = Cartesian3.cross(right, up, new Cartesian3());
    //顺时针
    normal = Cartesian3.negate(Cartesian3.normalize(normal, normal), normal);

    //构建平面
    let originCenteredPlane = new Plane(normal, 0.0);
    //中点到平面的距离
    let distance = Plane.getPointDistance(originCenteredPlane, midpoint);
    //存储动态绘制的剖切面
    clippingPlanes.push(new ClippingPlane(normal, distance));
  }
  //将剖切面赋值给地质
  window.viewer.scene.globe.clippingPlanes = new ClippingPlaneCollection({
    planes: clippingPlanes,
    edgeColor: Color.DIMGRAY,
    edgeWidth: 1.0,
    enabled: true,
    unionClippingRegions: false //设置为true，即取并集,false 交集
  });
  window.viewer.scene.skyBox.show = false;
}
export function cancel() {
  console.log('取消所有');
  handler.destroy();
  pointArray = [];
  window.viewer.scene.globe.clippingPlanes && (viewer.scene.globe.clippingPlanes.removeAll());

}
