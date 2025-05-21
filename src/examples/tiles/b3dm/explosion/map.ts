import { Cartographic, defined, CMath, Matrix4, JulianDate, Cartesian3, HeadingPitchRoll, PGEarth3DTile, Geokey3DTileset, Ellipsoid, Transforms } from "geokey-gis";

// let baoInter: NodeJS.Timer; // 爆炸定时器
// let modStatusTottle: number = 0; //模型状态 0:合并 1:分解;
let sortTileset: any[] = [];
let tileset: Geokey3DTileset;

export async function loadMainTileset() {
  window.viewer.clockViewModel.currentTime = JulianDate.fromDate(new Date('2021/10/28 12:00:00')); //北京时间

  tileset = await new Geokey3DTileset({
    url: 'http://219.151.151.45:10250/sxdzjm/MapData/zuankong/combine2_1/tileset.json',
    // url: 'http://192.168.1.16:3000/combine2_lod/tileset.json',
    maximumScreenSpaceError: 2,
    maximumMemoryUsage: 512,
    lightColor: new Cartesian3(10, 10, 10)
  }).readyPromise;
  tileset.tileLoad.addEventListener(function (tile) {
    // tile.content.readyPromise()
    console.log('tile.content: ', tile.content);
  });
  window.viewer.scene.primitives.add(tileset);
  window.viewer.zoomTo(tileset);



  // const modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(113.98356367338889, 22.526809721991665, 0));
  // tileset.root.transform = modelMatrix;
}

export function cancelTilesetExplosion() {
  const MatrixStart = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const initMatrix = Matrix4.fromArray(MatrixStart);
  sortTileset.forEach((item: any, index: number) => {
    item.transform = initMatrix;
  });
}

export function randomMatriTottle(height: number) {
  sortTileset = [];
  const tileLayer = (window.viewer.scene.primitives as any)._primitives[0];
  tileLayer._selectedTiles.forEach((item: any) => {
    if (defined(item.content._contents)) {
      const contentChilds = item.content._contents;
      for (let index = contentChilds.length - 1; index >= 0; index--) {
        sortTileset.push(contentChilds[index].tile);
      }
    } else {
      sortTileset.push(item);
    }
  });
  sortTileset.sort((curr, prev) => {
    return curr._contentHeader.uri.split('_')[1].split('.')[0] - prev._contentHeader.uri.split('_')[1].split('.')[0];
  });
  sortTileset.forEach((item: any, index: number) => {
    let targetHeight: number = 0;
    targetHeight = height * (index + 1);
    explosionMatrix4(item, targetHeight);
  });
}

function explosionMatrix4(tileset: PGEarth3DTile, target: number) {
  const tilesetCenter = tileset.boundingSphere.center;
  const cartographic = Cartographic.fromCartesian(tilesetCenter);
  const longitude = CMath.toDegrees(cartographic.longitude);
  const latitude = CMath.toDegrees(cartographic.latitude);
  const altitude = cartographic.height + target;
  const headingPitchRoll = new HeadingPitchRoll();
  const converter = Transforms.localFrameToFixedFrameGenerator('up', 'south');
  const frompointToWorldMatrix = Transforms.headingPitchRollToFixedFrame(tilesetCenter, headingPitchRoll, Ellipsoid.WGS84, converter);

  const result = Cartesian3.fromDegrees(longitude, latitude, altitude);
  const targetpointToWorldMatrix = Transforms.headingPitchRollToFixedFrame(result, headingPitchRoll, Ellipsoid.WGS84, converter);

  const worldTranslation = new Cartesian3(0, 0, targetpointToWorldMatrix[14] - frompointToWorldMatrix[14]);
  const modelTranslate = Matrix4.fromTranslation(worldTranslation);
  tileset.transform = modelTranslate;
}
