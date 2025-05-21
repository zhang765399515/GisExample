import { Geokey3DTileset, Cartesian3, ClippingPolygonCollection, ClippingPolygon } from 'geokey-gis';
export async function load3dtiles() {
  try {
    const tileset = await Geokey3DTileset.fromUrl('http://192.168.1.20:10252/geokey/gis/3DModel/?layers=cs_3dtile');
    window.viewer.scene.primitives.add(tileset);
    window.viewer.camera.setView({
        destination: {
            "x": -2390169.773322854,
            "y": 5390543.976358631,
            "z": 2423753.4506166517
        },
        orientation: {
            heading: 5.868283238640601,
            pitch: -0.9181128692768992,
            roll:  6.283158779993642,
        },
    });
    // const positions = footprint.polygon.hierarchy.getValue().positions;
    const lonLatArray: number[][] = [
      [113.91016182815036, 22.48277953408739, 113.91046684491097, 22.48269541424013, 113.91019651859527, 22.482191735897867],
      [113.91204404829611, 22.484270157737317,113.91157439417248, 22.484448754087204, 113.91232621785049, 22.484735677625103]
    ];
    // 将裁剪多边形集合添加到全局瓦片集
    tileset.clippingPolygons = getClippingPolygons({
      lonLatArray,
      inverse: true
    });
  } catch (error) {
    console.error(`tileset 创建失败: ${error}`);
  }
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
