import { Geokey3DTileset, Cartographic, CMath, Cartesian3, Matrix4 } from 'geokey-gis';
import menu from './menu.json';

let tile: any = {}; //用于保存模型以便下面使用
export function load3dtiles() {
  window.viewer.surfacePierce.enable = true;
  window.viewer.surfacePierce.alpha = 0.1

  let TraversalFunc = (modelVal: any[]) => {
    modelVal.forEach(e => {
      if (e.children) {
        TraversalFunc(e.children);
      } else {
        loadB3dm(e);
      }
    });
  };
  TraversalFunc(menu);
}
export function loadB3dm(data: { jsonUrl: any }) {
  tile = window.viewer.scene.primitives.add(
    new Geokey3DTileset({
      url: data.jsonUrl
    })
  );
  tile.layerName = 'explode';
  window.viewer.scene.primitives.add(tile);
  tile.readyPromise.then((res: any) => {
    window.viewer.zoomTo(res);
  });
}
export function spacingChange(val: any) {
  let _primitives: Object[] = [];
  window.viewer.scene.primitives._primitives.forEach((e: any) => {
    if (e.layerName == 'explode') {
      _primitives.push(e);
    }
  });
  let bottomNum = 0;
  let topLayer: any[] = [];
  _primitives.forEach((e:any) => {
    var cartographic = Cartographic.fromCartesian(e.boundingSphere.center);
    var lng = CMath.toDegrees(cartographic.longitude); //使用经纬度和弧度的转换，将WGS84弧度坐标系转换到目标值，弧度转度
    var lat = CMath.toDegrees(cartographic.latitude);
    var surface = Cartesian3.fromDegrees(lng, lat, 0.0);
    if (cartographic.height > 0) {
      topLayer.unshift(e);
    } else {
      var cartographic = Cartographic.fromCartesian(e.boundingSphere.center);
      //计算中心点位置的地表坐标
      var offset = Cartesian3.fromDegrees(lng, lat, -val * bottomNum);
      var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
      e.modelMatrix = Matrix4.fromTranslation(translation);
      bottomNum++;
    }
  });
  topLayer.forEach((e, i) => {
    //计算中心点位置的地表坐标
    var cartographic = Cartographic.fromCartesian(e.boundingSphere.center);
    var lng = CMath.toDegrees(cartographic.longitude); //使用经纬度和弧度的转换，将WGS84弧度坐标系转换到目标值，弧度转度
    var lat = CMath.toDegrees(cartographic.latitude);
    //计算中心点位置的地表坐标
    var surface = Cartesian3.fromDegrees(lng, lat, 0.0);
    var offset = Cartesian3.fromDegrees(lng, lat, val * i);
    var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
    e.modelMatrix = Matrix4.fromTranslation(translation);
  });
}
export function spacingCancel() {
  window.viewer.scene.primitives._primitives.forEach((e: any) => {
    if (e.layerName == 'explode') {
      e.modelMatrix = {
        0: 1,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 1,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 1,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 1
    };
    }
  });

}
