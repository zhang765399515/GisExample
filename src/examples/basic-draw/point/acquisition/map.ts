import {
    Color,
    CMath,
    Cartesian3,
    CallbackProperty,
    ConstantProperty,
    Entity,
    EllipsoidGeodesic,
    Graphic,
    GeoGraphicsLayer,
    HeightReference,
    JulianDate,
    GeoPolygon,
    PolygonGraphics,
    PolygonHierarchy,
    PolylineDashMaterialProperty,
    SimpleFillSymbol,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Ray,
    Rectangle
  } from "geokey-gis";
  import * as turf from '@turf/turf'
  import { defined } from '@/utils/common';
  import { xp } from '@/utils/tool/algorithm'
  
  /**
   * 圆形的采集功能
   */
  export function ellipseGather() {
    const basemap: any = document.getElementsByClassName('geokey-viewer')[0];
    //事件
    let handler: any = null;
    //中心点
    let centerPoint: any = null;
    //采集的圆对象
    let ellipseGather: Entity | null;
    //鼠标变成加号
    basemap.style.cursor = 'crosshair';
    //进制地图移动
    window.viewer.scene.screenSpaceCameraController.enableRotate = false;
    window.viewer.scene.screenSpaceCameraController.enableZoom = false;
    handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    //鼠标点击事件
    handler.setInputAction((event: any) => {
      //获取加载地形后对应的经纬度和高程：地标坐标
      let ray: Ray = window.viewer.camera.getPickRay(event.position) as Ray;
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!defined(cartesian)) {
        return;
      }
  
      centerPoint = window.viewer.entities.add({
        name: 'centerPoint',
        position: cartesian,
        point: {
          color: Color.CHARTREUSE.withAlpha(1),
          pixelSize: 10,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          outlineColor: Color.WHITE,
          outlineWidth: 1
        }
      });
      
      //默认生成半径为0.1米的圆。
      ellipseGather = new Entity({
        position: cartesian,
        ellipse: {
          semiMinorAxis: 30000, //椭圆短轴（单位米）
          semiMajorAxis: 30000, //椭圆长轴（单位米）
          material: Color.RED.withAlpha(0.5),
          height: 0,
          outline: true,
          outlineColor: Color.WHITE,
          outlineWidth: 3
        }
      });
      window.viewer.entities.add(ellipseGather);
    }, ScreenSpaceEventType.LEFT_DOWN);
  
    // 对鼠标移动事件的监听
    handler.setInputAction((event: any) => {
      if (centerPoint == null || ellipseGather == null) {
        return;
      }
      //获取加载地形后对应的经纬度和高程：地标坐标
      let ray = window.viewer.camera.getPickRay(event.endPosition) as Ray;
      let radiusCartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!radiusCartesian) {
        return;
      }
      let centerCartesian = centerPoint.position.getValue(JulianDate.now());
      //计算移动点与中心点的距离（单位米）
      let centerTemp = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(centerCartesian);
      let radiusTemp = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(radiusCartesian);
      let geodesic = new EllipsoidGeodesic();
      geodesic.setEndPoints(centerTemp, radiusTemp);
      let radius = geodesic.surfaceDistance;
      if (radius <= 0) {
        return;
      }
      if (ellipseGather.ellipse) {
        ellipseGather.ellipse.semiMinorAxis = new CallbackProperty(function (time, result) {
          return radius;
        }, false);
        ellipseGather.ellipse.semiMajorAxis = new CallbackProperty(function (time, result) {
          return radius;
        }, false);
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);
  
    // 对鼠标抬起事件的监听(结束点采集)
    handler.setInputAction((event: any) => {
      //鼠标变成默认
      basemap.style.cursor = 'default';
      //开始鼠标操作地图
      window.viewer.scene.screenSpaceCameraController.enableRotate = true;
      window.viewer.scene.screenSpaceCameraController.enableZoom = true;
      //移除地图鼠标点击事件
      handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
      //移除地图鼠标移动事件
      handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
      //移除地图鼠标抬起事件
      handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
      let ellipsoid = window.viewer.scene.globe.ellipsoid;
      let cartographic = ellipsoid.cartesianToCartographic(centerPoint.position.getValue(JulianDate.now()));
      let lat = CMath.toDegrees(cartographic.latitude);
      let lng = CMath.toDegrees(cartographic.longitude);
      let height = cartographic.height;
  
      console.log('圆中心点：经度', lng + ',纬度：' + lat + ',高度：' + height);
      //如果圆半径小于0.5米则删除，防止出现默认为0.1米的被采集。该种情况则是用户取消圆采集
      if (ellipseGather && ellipseGather.ellipse && ellipseGather.ellipse.semiMinorAxis && ellipseGather.ellipse.semiMinorAxis.getValue(JulianDate.now()) < 0.5) {
        console.log('圆半径：', ellipseGather.ellipse.semiMinorAxis.getValue(JulianDate.now()) + '米');
        window.viewer.entities.remove(ellipseGather);
        ellipseGather = null;
      }
      //清除圆中心点和半径点
      window.viewer.entities.remove(centerPoint);
      centerPoint = null;
    }, ScreenSpaceEventType.LEFT_UP);
  }
  
  /**
   * 方形的采集功能
   */
  export function rectangularGather() {
    const basemap: any = document.getElementsByClassName('geokey-viewer')[0];
    let handler: any = null;
    let startPoint: any = null;
    let rect: any = null;
    let layer = new GeoGraphicsLayer({
      id: 'layer1',
      viewer: window.viewer
    });
    window.viewer.map.add(layer);
    //鼠标变成加号
    basemap.style.cursor = 'crosshair';
    //进制地图移动
    window.viewer.scene.screenSpaceCameraController.enableRotate = false;
    window.viewer.scene.screenSpaceCameraController.enableZoom = false;
    handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    //鼠标点击事件
    handler.setInputAction((event: any) => {
      //获取加载地形后对应的经纬度和高程：地标坐标
      let ray: Ray = window.viewer.camera.getPickRay(event.position) as Ray;
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!defined(cartesian)) {
        return;
      }
      startPoint = window.viewer.entities.add({
        name: 'point',
        position: cartesian,
        point: {
          color: Color.CHARTREUSE.withAlpha(1),
          pixelSize: 10,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          outlineColor: Color.WHITE,
          outlineWidth: 1
        }
      });
  
      rect = window.viewer.entities.add({
        rectangle: {
          coordinates: Rectangle.fromCartesianArray([cartesian as Cartesian3, cartesian as Cartesian3]),
          material: Color.GREENYELLOW.withAlpha(0.5),
          outline: true,
          outlineColor: Color.WHITE,
          outlineWidth: 3
        }
      });
    }, ScreenSpaceEventType.LEFT_DOWN);
  
    // 对鼠标移动事件的监听
    handler.setInputAction((event: any) => {
      if (startPoint == null || rect == null) {
        return;
      }
      //获取加载地形后对应的经纬度和高程：地标坐标
      let ray: Ray = window.viewer.camera.getPickRay(event.endPosition) as Ray;
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!cartesian) {
        return;
      }
      let startCartesian = startPoint.position.getValue(JulianDate.now());
  
      rect.rectangle.coordinates = new CallbackProperty(function (time, result) {
        return Rectangle.fromCartesianArray([startCartesian, cartesian]);
      }, false);
    }, ScreenSpaceEventType.MOUSE_MOVE);
  
    // 对鼠标抬起事件的监听(结束点采集)
    handler.setInputAction((event: any) => {
      //鼠标变成默认
      basemap.style.cursor = 'default';
      window.viewer.scene.screenSpaceCameraController.enableRotate = true;
      window.viewer.scene.screenSpaceCameraController.enableZoom = true;
      window.viewer.entities.remove(startPoint);
      //移除地图鼠标点击事件
      handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
      //移除地图鼠标移动事件
      handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
      //移除地图鼠标抬起事件
      handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
      console.log(rect);
      let dke = rect.rectangle.coordinates.getValue();
      console.log('修改后的面坐标(笛卡尔)：', dke);
      let east = CMath.toDegrees(dke.east);
      let west = CMath.toDegrees(dke.west);
      let north = CMath.toDegrees(dke.north);
      let south = CMath.toDegrees(dke.south);
      console.log('矩形西南东北坐标:', west, south, east, north);
  
      let line = turf.lineString([
        [west, south],
        [east, north]
      ]);
      let bbox = turf.bbox(line);
      let bboxPolygon = turf.bboxPolygon(bbox);
      // 四个点
      console.log('四个点', bboxPolygon.geometry.coordinates[0]);
      let polygonGeo1 = new GeoPolygon({
        rings: bboxPolygon.geometry.coordinates[0]
      });
      let polygonSymbol1 = new SimpleFillSymbol({
        //type: 'simple-fill', 通过定义type属性无需 new SimpleFillSymbol
        color: { r: 255, g: 0, b: 0, a: 1 },
        outline: true, //是否显示边线，默认为false
        outlineColor: '#f2e81f',
        outlineWidth: 1 // 外边线目前只支持为 1
      });
      let polygonGraphic1 = new Graphic({
        id: 'polygon1',
        geometry: polygonGeo1,
        symbol: polygonSymbol1
      });
      layer.add(polygonGraphic1);
    }, ScreenSpaceEventType.LEFT_UP);
  }
  
  /**
   * 直角箭头的采集
   */
  export function rightAngleArrow() {
    let gatherPosition: any = []; //采集的点信息
    let floatingPoint: any = null; //移动点
    let drawHandler: any = null; //画事件
    let layerId = 'straightArrowLayer';
  
    gatherPosition = [];
    floatingPoint = null;
    clearPlot();
    drawHandler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  
    drawHandler.setInputAction(function (event: any) {
      let position = event.position;
      if (!defined(position)) {
        return;
      }
      let ray: Ray = window.viewer.camera.getPickRay(position) as Ray;
      if (!defined(ray)) {
        return;
      }
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!defined(cartesian)) {
        return;
      }
      let num = gatherPosition.length;
      if (num == 0) {
        gatherPosition.push(cartesian);
        floatingPoint = createPoint(cartesian, -1);
        showRegion2Map();
      }
      gatherPosition.push(cartesian);
      let oid = gatherPosition.length - 2;
      createPoint(cartesian, oid);
      if (num > 1) {
        gatherPosition.pop();
        window.viewer.entities.remove(floatingPoint);
        //去掉事件
        if (drawHandler) {
          drawHandler.destroy();
          drawHandler = null;
        }
        //删除关键点
        clearKeyPoint();
        //获取直线箭头坐标数据
        getStraightArrowValue();
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
  
    drawHandler.setInputAction(function (event: any) {
      let position = event.endPosition;
      if (!defined(position)) {
        return;
      }
      let ray: Ray = window.viewer.camera.getPickRay(position) as Ray;
      if (!defined(ray)) {
        return;
      }
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!defined(cartesian)) {
        return;
      }
      if (floatingPoint == null) {
        return;
      }
      floatingPoint.position.setValue(cartesian);
      gatherPosition.pop();
      gatherPosition.push(cartesian);
    }, ScreenSpaceEventType.MOUSE_MOVE);
  
    function createPoint(cartesian: any, oid: any) {
      let point: any = window.viewer.entities.add({
        position: cartesian,
        billboard: {
          image: './image/gatherPoint.png',
          eyeOffset: new ConstantProperty(new Cartesian3(0, 0, -500)),
          heightReference: HeightReference.CLAMP_TO_GROUND
        }
      });
      point.oid = oid;
      point.layerId = layerId;
      point.flag = 'keypoint';
      return point;
    }
    
    function showRegion2Map() {
      let material = Color.fromCssColorString('#ff0').withAlpha(0);
      let outlineMaterial = new PolylineDashMaterialProperty({
        dashLength: 16,
        color: Color.fromCssColorString('#f00').withAlpha(0.7)
      });
  
      let dynamicHierarchy = new CallbackProperty(function () {
        if (gatherPosition.length > 1) {
          let p1 = gatherPosition[0];
          let p2 = gatherPosition[1];
          if (isSimpleXYZ(p1, p2)) {
            return null;
          }
          let firstPoint = getLonLat(p1);
          let endPoints = getLonLat(p2);
          let arrow = xp.algorithm.fineArrow([firstPoint.lon, firstPoint.lat], [endPoints.lon, endPoints.lat], Cartesian3);
          let pHierarchy: any = new PolygonHierarchy(arrow);
          pHierarchy.keyPoints = [firstPoint, endPoints];
          return pHierarchy;
        } else {
          return null;
        }
      }, false);
      let outlineDynamicPositions = new CallbackProperty(function () {
        if (gatherPosition.length < 2) {
          return null;
        }
        let p1 = gatherPosition[0];
        let p2 = gatherPosition[1];
        if (isSimpleXYZ(p1, p2)) {
          return null;
        }
        let firstPoint = getLonLat(p1);
        let endPoints = getLonLat(p2);
        let arrow = xp.algorithm.fineArrow([firstPoint.lon, firstPoint.lat], [endPoints.lon, endPoints.lat], Cartesian3);
        arrow.push(arrow[0]);
        return arrow;
      }, false);
      let bData = {
        polygon: new PolygonGraphics({
          hierarchy: dynamicHierarchy,
          material: material,
          show: true
        }),
        polyline: {
          positions: outlineDynamicPositions,
          clampToGround: true,
          width: 2,
          material: outlineMaterial,
          show: true
        }
      };
      let entity: any = window.viewer.entities.add(bData);
      entity.layerId = layerId;
      entity.valueFlag = 'value';
    }
    /**
     * 判断两点是否一致
     * @param p1 - 点1
     * @param p2 - 点2
     * @returns
     */
    function isSimpleXYZ(p1: Cartesian3, p2: Cartesian3) {
      if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
        return true;
      }
      return false;
    }
    /**
     * 笛卡尔坐标转经纬度坐标
     */
    function getLonLat(cartesian: Cartesian3) {
      let cartographic = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      cartographic.height = window.viewer.scene.globe.getHeight(cartographic) as number;
      let pos = {
        lon: cartographic.longitude,
        lat: cartographic.latitude,
        alt: cartographic.height
      };
      pos.lon = CMath.toDegrees(pos.lon);
      pos.lat = CMath.toDegrees(pos.lat);
      return pos;
    }
    /**
     * 删除直线箭头
     */
    function clearPlot() {
      let entityList = window.viewer.entities.values;
      if (entityList == null || entityList.length < 1) {
        return;
      }
      for (let i = 0; i < entityList.length; i++) {
        let entity = entityList[i];
        if (entity.id == layerId) {
          window.viewer.entities.remove(entity);
          i--;
        }
      }
    }
    /**
     * 删除关键点
     */
    function clearKeyPoint() {
      let entityList = window.viewer.entities.values;
      if (entityList == null || entityList.length < 1) {
        return;
      }
      for (let i = 0; i < entityList.length; i++) {
        let entity: any = entityList[i];
        if (entity.flag == 'keypoint') {
          window.viewer.entities.remove(entity);
          i--;
        }
      }
    }
    /**
     * 获取采集的直线箭头数据
     */
    function getStraightArrowValue() {
      //删除关键点
      clearKeyPoint();
      let entityList = window.viewer.entities.values;
      for (let i = 0; i < entityList.length; i++) {
        let entity: any = entityList[i];
        if (typeof entity.valueFlag != 'undefined') {
          console.log('采集的直线箭头(笛卡尔)：', entity.polygon.hierarchy.getValue().positions);
          let dke = entity.polygon.hierarchy.getValue().positions;
          let objArr = [];
          for (let i = 0; i < dke.length; i++) {
            let ellipsoid = window.viewer.scene.globe.ellipsoid;
            let cartesian3 = new Cartesian3(dke[i].x, dke[i].y, dke[i].z);
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            let obj: any = {};
            obj.lat = CMath.toDegrees(cartographic.latitude);
            obj.lng = CMath.toDegrees(cartographic.longitude);
            objArr.push(obj);
          }
          console.log('采集的直线箭头(经纬度)', objArr);
          console.log('采集的直线箭头关键点', entity.polygon.hierarchy.getValue().keyPoints);
        }
      }
    }
  }
  