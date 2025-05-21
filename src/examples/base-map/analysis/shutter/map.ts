import {
  CallbackProperty,
  Cartesian3,
  PolygonHierarchy,
  Color,
  Cartesian2,
  EventDriven,
  defined,
  Primitive,
  GeometryInstance,
  PolygonGeometry,
  EllipsoidSurfaceAppearance,
  Material,
  geoTerrainLayer
} from 'geokey-gis';

export function widgetsYanmo() {
  console.log(111);

  let elevationLayer: any = new geoTerrainLayer({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=guangdong_dem',
    id: 'dem'
  });
  window.viewer.map.ground.layer.add(elevationLayer);
  let waterPolygon: any, tileset: any;
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  window.viewer.scene.requestRenderMode = false;
  /***************************** 画水柱 *********************************/
  var waterEntities = undefined;
  var waterTimer = undefined;
  var extrudedHeight = 1;
  const _drawWater = function (targetHeight: any, adapCoordi: any, newArrPoints: any) {
    let entity = window.viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArrayHeights(adapCoordi)),
        material: Color.fromBytes(64, 157, 253, 255),
        perPositionHeight: true,
        extrudedHeight: new CallbackProperty(function () {
          return extrudedHeight;
        }, false)
      }
    });
    waterEntities = entity;
    addWaterPolygon(newArrPoints, extrudedHeight);
    let waterHeight = adapCoordi[2];
    waterTimer = setInterval(() => {
      if (waterHeight < targetHeight) {
        waterHeight += 3;
        if (waterHeight > targetHeight) {
          waterHeight = targetHeight;
        }
        extrudedHeight = waterHeight;
        addWaterPolygon(newArrPoints, extrudedHeight);
      }
    }, 500);
  };

  /***************************** 点击获取水面坐标 *********************************/
  var points: any = [];
  var pointLonLat: any = [];
  var myEntity: any = undefined;
  var waterPrimitives;
  var clickDraw = new EventDriven({
    viewer: window.viewer,
    eventType: 'left_click', // mouse_move,right_click
    callBack: function (e) {
      points.push(e.cartesian);
      pointLonLat.push(e.mapPoint);
      var length = points.length;
      createElements(pointLonLat[pointLonLat.length - 1]); //创建确定按钮
      if (length === 1) {
        window.viewer.entities.remove(myEntity);
        myEntity = window.viewer.entities.add({
          position: points[0],
          point: {
            pixelSize: 10,
            color: Color.SKYBLUE
          }
        });
      } else if (length === 2) {
        window.viewer.entities.remove(myEntity);
        myEntity = window.viewer.entities.add({
          name: 'Orange dashed line with a short dash length',
          polyline: {
            positions: points,
            width: 5,
            material: Color.SKYBLUE.withAlpha(0.6)
          }
        });
      } else if (length > 2) {
        window.viewer.entities.remove(myEntity);
        myEntity = window.viewer.entities.add({
          name: 'Red polygon on surface',
          polygon: {
            hierarchy: points,
            perPositionHeight: true,
            material: Color.SKYBLUE.withAlpha(0.6)
          }
        });
      }
    }
  });
  function createElements(p: any) {
    var dockObj = document.getElementById('mybuttonYm');
    dockObj && document.body.removeChild(dockObj);
    var myElement = document.createElement('input');
    myElement.type = 'button';
    //给新元素添加必要的信息
    myElement.id = 'mybuttonYm';
    myElement.value = '确定';
    //给新元素指定位置
    myElement.style.position = 'absolute';
    myElement.style.background = 'rgba(34, 37, 40, 0.9)';
    myElement.style.color = '#fff';
    myElement.style.border = 'none';
    //添加到document.body上
    document.body.appendChild(myElement);
    myElement.onclick = function () {
      endDraw();
    };
    let inputRenderFun = function () {
      var position = Cartesian3.fromDegrees(p.longitude, p.latitude, p.height);
      var scratch = new Cartesian2();
      var canvasPosition = window.viewer.scene.cartesianToCanvasCoordinates(position, scratch);
      if (defined(canvasPosition)) {
        myElement.style.top = canvasPosition.y + 'px';
        myElement.style.left = canvasPosition.x + 'px';
        myElement.style.zIndex = '999';
      }
    };
    // 定义元素位置
    window.viewer.scene.postRender.addEventListener(inputRenderFun);
  }

  // 右键停止绘制
  var rightEvent = new EventDriven({
    viewer: window.viewer,
    eventType: 'right_click', // mouse_move,right_click
    callBack: function (e) {
      endDraw();
    }
  });

  function endDraw() {
    clickDraw && !clickDraw.isDestroyed() && clickDraw.destroy();
    window.viewer.entities.remove(myEntity);
    var newArrPoints = [],
      heightArr = [];
    for (var i = 0; i < pointLonLat.length; i++) {
      newArrPoints.push([pointLonLat[i].longitude, pointLonLat[i].latitude]);
      heightArr.push(pointLonLat[i].height);
    }

    var minH = Math.min.apply(Math, heightArr);
    var maxH = Math.max.apply(Math, heightArr);

    var water3DPoints = [];
    for (var j = 0; j < pointLonLat.length; j++) {
      water3DPoints.push(pointLonLat[j].longitude, pointLonLat[j].latitude, minH);
    }

    _drawWater(maxH, water3DPoints, newArrPoints);
  }

  /*************** 动态水面 ************************/
  var roadWaterModelLayer;
  function addWaterPolygon(newArrPoints: any, height: number) {
    console.log(newArrPoints, height);
    var newWaterPolygon = window.viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new PolygonGeometry({
            polygonHierarchy: new PolygonHierarchy(Cartesian3.fromDegreesArray(newArrPoints.flat())),
            vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            height: height + 0.5
          })
        }),
        appearance: new EllipsoidSurfaceAppearance({
          material: new Material({
            fabric: {
              type: 'Water',
              uniforms: {
                normalMap: 'src/components/baseMap/common/img/waterNormalsSmall.jpg',
                frequency: 1000.0,
                animationSpeed: 0.01,
                amplitude: 1.0,
                color: '#2f83a0'
              }
            }
          })
        })
      })
    );
    newWaterPolygon.readyPromise.then(function () {
      waterPolygon && window.viewer.scene.primitives.remove(waterPolygon);
      waterPolygon = newWaterPolygon;
    });
  }
}
