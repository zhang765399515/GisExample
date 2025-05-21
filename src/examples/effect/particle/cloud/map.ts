import { CMath, Color, CloudCollection, Cartesian3, Cartesian2 } from 'geokey-gis';
export function addCloud() {
  let center = {
    longitude: 113.952492,
    latitude: 22.534648,
    height: 200
  };
  var clouds = window.viewer.scene.primitives.add(
    new CloudCollection({
      noiseDetail: 16.0
    })
  );

  // 随机生成数据
  let list = [];
  for (let i = 0; i < 300; i++) {
    list.push({
      lnglat: [
        center.longitude + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
        center.latitude + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
        center.height + Math.random() * 50
      ],
      x: 500 * Math.random() + 500,
      y: 200 * Math.random() + 200
    });
  }

  //添加云
  for (let i = 0; i < list.length; i++) {
    clouds.add({
      position: Cartesian3.fromDegrees(list[i].lnglat[0], list[i].lnglat[1], list[i].lnglat[2]),
      scale: new Cartesian2(list[i].x, list[i].y),
      slice: 0.36,
      brightness: 1
    });
  }
  window.viewer.camera.setView({
    destination: Cartesian3.fromDegrees(113.912492, 22.464648, 5000.0),
    orientation: {
        heading: 0.4467187150510856,
        pitch: -0.5061059714147422,
        roll: 0.00021289318413675318
    }
  });
  // window.viewer.camera.flyTo({
  //     destination: Cartesian3.fromDegrees(113.952492, 22.534648, 200.0),
  //     duration: 1
  // })
}
