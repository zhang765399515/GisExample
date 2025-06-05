import { Geokey3DTileset, Cartesian3, ClippingPolygonCollection, ClippingPolygon } from 'geokey-gis';
let tileset:any;
export async function load3dtiles() {
  try {
    tileset = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/hsl/tileset.json?serviceName=hsl_B3dm')
        window.viewer.scene.primitives.add(tileset);
        window.viewer.zoomTo(tileset)
    // const positions = footprint.polygon.hierarchy.getValue().positions;
    
    // 将裁剪多边形集合添加到全局瓦片集
    
  } catch (error) {
    console.error(`tileset 创建失败: ${error}`);
  }
}
export function clopModel(){
  console.log(1)
  const lonLatArray: number[][] = [
    [114.491824, 22.683658, 114.492176, 22.649978,114.494141, 22.6438885897867]
  ];
  tileset.clippingPolygons = getClippingPolygons({
    lonLatArray,
    inverse: true
  });
  console.log('name：tileset.clippingPolygons',tileset.clippingPolygons);
}
export function cancelModel(){
  tileset.clippingPolygons.enabled = false;

}
interface ClippingPolygonsOptions {
  lonLatArray: number[][]; // 经纬度数组，每个元素是 [lon, lat]
  inverse?: boolean; // 可选参数，默认为 false
}
function getClippingPolygons(options: ClippingPolygonsOptions) {
  const { lonLatArray, inverse = false } = options;
  const polygonsArray: ClippingPolygon[] = [];
  lonLatArray.forEach(e => {
    polygonsArray.push(
      new ClippingPolygon({
        positions: Cartesian3.fromDegreesArray(e)
      })
    );
  });
  const clippingPolygons = new ClippingPolygonCollection({
    polygons: polygonsArray,
    inverse: inverse
  });
  return clippingPolygons;
}
