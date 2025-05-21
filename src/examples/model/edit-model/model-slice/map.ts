import { Geokey3DTileset, Geokey3DTileStyle, Color } from 'geokey-gis';
let tile:any = {};//用于保存模型以便下面使用
export function load3dtiles() {
  tile = window.viewer.scene.primitives.add(
    new Geokey3DTileset({
      url: 'http://192.168.1.191:10149/models/szw/model_json/model/1-1/tileset.json'
    })
  );
  tile.readyPromise.then(res => {
    window.viewer.zoomTo(res);
  });
}
export function cut() {
  let points = [
    {
      longitude: 113.97365456450287,
      latitude: 22.528736862881964
    },
    {
      longitude: 113.9753465383993,
      latitude: 22.526579986284897
    }
  ];
  tile.ClippingPlanesCalculate.clippingPlanesFun({
    points: points,
    clockwiseOrder: false //更换剖切方向
  });
}
export function cancel() {
    tile.clippingPlanes.enabled = false;
}