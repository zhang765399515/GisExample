import { Cartesian3, Resource, GeoGraphicsLayer, QueryTask, Query, ImageMaterialProperty, CallbackProperty, PolygonHierarchy } from "geokey-gis";

export function loadMeteorology() {
  let urls = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg', '/img/3.jpg'];
  let myUrls: any = [];
  let i = 2;
  let speed = 10;
  window.viewer.camera.flyTo({
    destination: new Cartesian3(-106580.38070550878, 5888706.1038468275, 3400189.174955603)
  });
  let cutPic = function (url: string, index: number) {
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = 550;
    canvas.height = 383;
    canvas.id = 'wxytCanvas' + index;
    canvas.style.display = 'block';
    (canvas.getContext('2d') as CanvasRenderingContext2D).globalAlpha = 0.75; //设置透明度
    let resource = (Resource as any).createIfNeeded(url);
    return resource.fetchImage().then(function (image: any) {
      (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(image, 80, 80, 150, 120, 0, 0, 550, 383);
      return canvas;
    });
  };
  for (let j = 0; j < urls.length - 1; j++) {
    Promise.resolve(cutPic(urls[j], j)).then(function (img) {
      myUrls.push(img.toDataURL());
    });
  }
  let qfLyaer = new GeoGraphicsLayer({
    id: 'qfLyaer'
  });
  window.viewer.map.add(qfLyaer);
  let task = new QueryTask({
    layer: 'cc:cq_ws_hs_zhdj1',
    url: 'http://221.13.67.194:12022/service/gis/server/xz_lasa_waibianjie_mian'
  });
  let query = new Query({
    where: '',
    spatialRelation: 'INTERSECTS'
  });

  let queryResult = task.execute(query);
  queryResult.then(function (dataSource: any) {
    let entities = dataSource.entities.values;
    entities.map((item: any) => {
      window.viewer.entities.add({
        polygon: {
          hierarchy: new PolygonHierarchy(item.polygon.hierarchy._value.positions),
          material: new ImageMaterialProperty({
            image: new CallbackProperty(() => {
              if (myUrls.length) {
                if (i < speed * myUrls.length - 1) {
                  i++;
                } else {
                  i = 0;
                }
                return myUrls[Math.floor(i / speed)];
              }
            }, false)
          })
        },
        id: 'wxyt'
      });
    });
    window.viewer.scene.requestRender();
  });
}
