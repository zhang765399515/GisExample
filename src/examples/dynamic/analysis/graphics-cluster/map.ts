/*
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2023-12-28 15:18:18
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2023-12-28 15:37:55
 * @FilePath: \vite-pgEarth\src\examples\dynamic\analysis\graphics-cluster\map.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ClusterLayer, Color, Graphic } from "geokey-gis";

export function generatePosition(num: any) {
  let list = []
  for (let i = 0; i < num; i++) {
    let lng = 106.55 + Math.random() * 0.5
    let lat = 27.6 + Math.random() * 0.5
    list.push({ name: 'point' + i, position: [lng, lat] })
  }
  return list
}
export function loadClusterLayer() {
  window.viewer.goTo({
    center: [106.55, 27.6, 1000000]
  })
  let points = generatePosition(10000)
  let clusterLayer = new ClusterLayer({
    id: 'myData',
    size: 18, //聚合点的尺寸
    pixelRange: 50, // 点之间的像素范围
    gradient: {
      0.0001: Color.DEEPSKYBLUE,
      0.001: Color.GREEN,
      0.01: Color.ORANGE,
      0.1: Color.RED
    },  // 幅度颜色设置
    fontSize: 12, // 字体大小
  })
  for (let i = 0; i < points.length; i++) {
    let picturePoint3 = {
      type: "point",
      longitude: points[i].position[0],
      latitude: points[i].position[1],
      height: 1000
    }
    let pictureSymbol1 = {  //type:'picture-marker',通过定义type属性无需 new PictureMarkerSymbol
      type: 'picture-marker',
      width: 30,
      height: 30,
      url: 'image/ms.png'
    }
    let pictureGraphic3 = new Graphic({
      geometry: picturePoint3,
      symbol: pictureSymbol1,
      popupEnabled: true,//默认为false
      popupTemplate: {
        title: "图片信息",
        content: "这是第二张图片"
      }
    })
    clusterLayer.add(pictureGraphic3);
  }
  window.viewer.map.add(clusterLayer)
}
