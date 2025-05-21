import {
  CMath,
  Color,
  Cartesian3,
  Cartographic,
  CallbackProperty,
  defined,
  ScreenSpaceEventType,
  GeokeyTerrainProvider,
  HeightReference,
  Rectangle,
  PolygonHierarchy,
  sampleTerrain,
  sampleTerrainMostDetailed
} from "geokey-gis";

import { featureCollection, tin } from '@turf/turf';

const scratchCreateMeshOptions = {
  tilingScheme: undefined,
  x: 0,
  y: 0,
  level: 0,
  exaggeration: 1.0,
  exaggerationRelativeHeight: 0.0,
  throttle: true
};
class RapidFlatten {
  _viewer: any = undefined;
  _activeShape = undefined;
  _floatingPoint = undefined;
  _drawingMode = 'polygon';
  _activeShapePoints: Cartesian3[] = [];
  _activeGraphicPoints: Cartographic[] = [];
  _tileCollect = [];

  constructor(viewer: any) {
    this._viewer = viewer;
    this._activeShape = undefined;
    this._floatingPoint = undefined;
    this._drawingMode = 'polygon';
    this._tileCollect = [];
    this._viewer.scene.globe.depthTestAgainstTerrain = true;

    const terrainProvider = new GeokeyTerrainProvider({
      url: 'http://36.134.121.25:12022/service/gis/3DModel/?serviceName=sz_dem',
      requestVertexNormals: true,
      requestWaterMask: true
    });
    this._viewer.terrainProvider = terrainProvider;

    const _this = this;
    const handler = this._viewer.screenSpaceEventHandler;

    //鼠标左键
    handler.setInputAction((event: any) => {
      //获取场景中的世界坐标
      const earthPosition: Cartesian3 = _this._viewer.scene.pickPosition(event.position);
      const graphicPosition: Cartographic = Cartographic.fromCartesian(earthPosition);
      if (defined(earthPosition)) {
        this._activeShapePoints.push(earthPosition);
        this._activeGraphicPoints.push(graphicPosition);
        //没有定义绘制一个点，存在则不绘制
        if (!defined(this._floatingPoint)) {
          this._floatingPoint = _this.drawPoint(this._activeShapePoints);
        }
        //没有定义绘制形状，存在则不绘制
        if (!defined(this._activeShape)) {
          this._activeShape = _this.drawShape(this._activeShapePoints); //绘制动态图
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    //鼠标移动
    handler.setInputAction((event: any) => {
      //用鼠标移动的结束位置，获取场景中的世界坐标
      let newPosition = _this._viewer.scene.pickPosition(event.endPosition);
      let newGraphicPosition = Cartographic.fromCartesian(newPosition);
      if (defined(newPosition)) {
        this._activeShapePoints.pop();
        this._activeGraphicPoints.pop();
        this._activeShapePoints.push(newPosition);
        this._activeGraphicPoints.push(newGraphicPosition);
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    //鼠标右键绘制结束
    handler.setInputAction((event: any) => {
      _this.stopShape();
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }

  drawPoint(activeShapePoints: any) {
    let point = this._viewer.entities.add({
      position: new CallbackProperty(() => {
        return activeShapePoints[activeShapePoints.length - 1];
      }, false),
      point: {
        pixelSize: 10, //像素大小
        color: Color.RED.withAlpha(0.8),
        outlineColor: Color.WHITE,
        outlineWidth: 1,
        heightReference: HeightReference.CLAMP_TO_GROUND //贴地
      }
    });
    return point;
  }

  drawShape(activeShapePoints: any) {
    const createMeshOptions = scratchCreateMeshOptions;

    const drawRect = Rectangle.fromCartesianArray(activeShapePoints);
    const rect = this._viewer.entities.add({
      name: 'rectangle',
      rectangle: {
        coordinates: drawRect,
        material: Color.RED.withAlpha(0.5)
      }
    });

    const availableTile = this._viewer.terrainProvider.availability;
    const maxAvailableLevel = availableTile.computeBestAvailableLevelOverRectangle(drawRect);

    const quadtreeTiles = this._viewer.scene.globe._surface._tilesToRender;
    quadtreeTiles.forEach(tile => {
      this.getTileCollection(drawRect, tile);
    });

    Promise.resolve(sampleTerrain(this._viewer.terrainProvider, maxAvailableLevel, this._activeGraphicPoints)).then(cartographicArr => {});

    this._tileCollect.forEach(tile => {
      // createMeshOptions.tilingScheme = tile.tilingScheme;
      // createMeshOptions.x = tile.x;
      // createMeshOptions.y = tile.y;
      // createMeshOptions.level = tile.level;
      // createMeshOptions.exaggeration = 0.0;
      // createMeshOptions.exaggerationRelativeHeight = 20;
      // createMeshOptions.throttle = true;

      const terrainDataPromise = this._viewer.terrainProvider.requestTileGeometry(tile.x, tile.y, tile.level);
      Promise.resolve(terrainDataPromise).then(terrainData => {
        const meshPromise = terrainData.createMesh(tile.tilingScheme, tile.x, tile.y, tile.level, 0.0);
        Promise.resolve(meshPromise)
          .then(function (mesh) {})
          .catch(function () {});
      });
    });

    let shape;
    if (this._drawingMode === 'line') {
      shape = this._viewer.entities.add({
        polyline: {
          positions: new CallbackProperty(() => {
            return activeShapePoints;
          }, false),
          clampToGround: true,
          width: 3,
          material: Color.WHITE.withAlpha(0.5)
        }
      });
    } else if (this._drawingMode === 'polygon') {
      shape = this._viewer.entities.add({
        polygon: {
          hierarchy: new CallbackProperty(() => {
            return new PolygonHierarchy(activeShapePoints);
          }, false),
          material: Color.fromRandom({ alpha: 0.5 })
        }
      });
    } else if (this._drawingMode === 'circle') {
      shape = this._viewer.entities.add({
        position: activeShapePoints[0],
        name: 'ellipse',
        ellipse: {
          semiMinorAxis: new CallbackProperty(() => {
            let r = Math.sqrt(
              Math.pow(activeShapePoints[0].x - activeShapePoints[activeShapePoints.length - 1].x, 2) +
                Math.pow(activeShapePoints[0].y - activeShapePoints[activeShapePoints.length - 1].y, 2)
            );
            return r ? r : r + 1;
          }, false),
          semiMajorAxis: new CallbackProperty(() => {
            let r = Math.sqrt(
              Math.pow(activeShapePoints[0].x - activeShapePoints[activeShapePoints.length - 1].x, 2) +
                Math.pow(activeShapePoints[0].y - activeShapePoints[activeShapePoints.length - 1].y, 2)
            );
            return r ? r : r + 1;
          }, false),
          material: Color.WHITE.withAlpha(0.5),
          outline: true
        }
      });
    } else if (this._drawingMode === 'rectangle') {
      shape = this._viewer.entities.add({
        name: 'rectangle',
        rectangle: {
          coordinates: new CallbackProperty(() => {
            return Rectangle.fromCartesianArray(activeShapePoints);
          }, false),
          material: Color.WHITE.withAlpha(0.5)
        }
      });
    }
    return shape;
  }

  getTileCollection(rectRange, tile) {
    if (tile.children.length) {
      tile.children.forEach(child => {
        let childIntersect = Rectangle.intersection(rectRange, child.rectangle);
        if (childIntersect && child.level == 16) {
          this._tileCollect.push(child);
        }
      });
    }
  }

  stopShape() {
    if (this._activeShapePoints.length) {
      this.drawShape(this._activeShapePoints); //绘制最终图
    }
    if (defined(this._floatingPoint) && defined(this._activeShape)) {
      this._viewer.entities.remove(this._floatingPoint); //去除动态点图形（当前鼠标点）
      this._viewer.entities.remove(this._activeShape); //去除动态临时图
    }
    //生成tin三角网
    this.addFlattenSurface(this._activeShapePoints);
    this._floatingPoint = undefined;
    this._activeShape = undefined;
    this._activeShapePoints = [];
  }

  addFlattenSurface() {
    const _this = this;
    sampleTerrainMostDetailed(this._viewer.terrainProvider, this._activeGraphicPoints).then(cartographicArr => {
      cartographicArr.forEach(item => {
        let position = Cartographic.toCartesian(item);
        _this._viewer.entities.add({
          position: position,
          name: 'posasa',
          point: {
            pixelSize: 5
          }
        });
      });
    });
  }

  addTinGrid(activeShapePoints) {
    let geojson = {
      type: 'FeatureCollection',
      features: []
    };
    //将世界坐标转成经纬度
    for (const activeShapePoint of activeShapePoints) {
      let cartographic = Cartographic.fromCartesian(activeShapePoint);
      let longitude = CMath.toDegrees(cartographic.longitude);
      let latitude = CMath.toDegrees(cartographic.latitude);
      let feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      };
      geojson.features.push(feature);
    }
    //生成网格
    let points = featureCollection(geojson.features);
    let tins = tin(points, 'z');
    tins.features.forEach(feature => {
      let coordinates = feature.geometry.coordinates.flat(Infinity);
      this._viewer.entities.add({
        polyline: {
          positions: Cartesian3.fromDegreesArray(coordinates),
          width: 5,
          material: Color.RED,
          clampToGround: true
        }
      });
    });
  }

  clear() {}
}

export default RapidFlatten;
