import { Geokey3DTileset, Geokey3DTileStyle, Color, Geokey3DTileStyle } from 'geokey-gis';
let tile: any = {}; //用于保存模型以便下面使用
export function load3dtiles() {
  tile = window.viewer.scene.primitives.add(
    new Geokey3DTileset({
      url: 'http://szugsdemo.igeokey.com:10149/models/szw/model_json/model/1-1/tileset.json'
    })
  );
  tile.readyPromise.then(res => {
    console.log('name：res', res);
    res.style = new Geokey3DTileStyle({
      color: 'color("red")' // 直接设置为红色
    });
    window.viewer.zoomTo(res);
  });
}
export function crop() {
  let points = [
    {
      longitude: 113.97365456450287,
      latitude: 22.528736862881964
    },
    {
      longitude: 113.9753465383993,
      latitude: 22.526579986284897
    },
    {
      longitude: 113.97644692511832,
      latitude: 22.52873679401122
    },
    {
      longitude: 113.97365456450287,
      latitude: 22.528736862881964
    }
  ];
  console.log(tile.ClippingPlanesCalculate);

  tile.ClippingPlanesCalculate.clippingPlanesFun({
    points: points,
    clockwiseOrder: false //更换裁剪还是开挖
  });
}
export function cancel() {
  tile.clippingPlanes.enabled = false;
}
