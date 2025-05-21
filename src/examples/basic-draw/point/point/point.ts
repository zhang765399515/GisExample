import {
    Color,
    DistanceDisplayCondition,
    NearFarScalar,
    Entity,
    HeightReference,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    CallbackProperty,
    CustomDataSource
} from "geokey-gis"
/**
 * 绘制各种实体对象
 * @param {*} viewer
 */
export function Draw(viewer) {
    if (viewer) {
      let _drawLayer = new CustomDataSource('drawLayer')
      viewer && viewer.dataSources.add(_drawLayer);
    }
    let GraphicsData = [];
}
Draw.prototype = {
    /**
   * 绘制点
   * @param {*} options
   */
  drawPointGraphics: function (options) {
    options = options || {};
    options.style = options.style || {
        pixelSize:10,//大小
        heightReference: HeightReference.NONE, //NONE绝对高度，CLAMP_TO_GROUND夹在地形上，RELATIVE_TO_GROUND贴地形
        color:Color.fromCssColorString('rgba(255,0,0,1)'),//颜色
        outlineColor:Color.fromCssColorString('rgba(255,0,0,1)'),//边框颜色
        outlineWidth:5,//边框宽度
        scaleByDistance: new NearFarScalar(1000000,0.1,10,1),//根据距离缩放
        translucencyByDistance:new NearFarScalar(1000000,0,1000,1),//根据距离设置透明度
        distanceDisplayCondition:new DistanceDisplayCondition(10, 20000),//指定相机多远的距离显示
        disableDepthTestDistance:Number.POSITIVE_INFINITY  //深度检测距离
    }
    if (this._viewer && options) {

      var _poiEntity = new Entity(),
        position,
        positionObj, $this = this,
        _handlers = new ScreenSpaceEventHandler(this._viewer.scene.canvas)
      // left
      _handlers.setInputAction(function (movement) {
        var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.position, $this._viewer.scene.globe.ellipsoid)
        console.log('name：cartesian',cartesian);
        if (cartesian && cartesian.x) {
          position = cartesian
        }
      }, ScreenSpaceEventType.LEFT_CLICK)

      _poiEntity.position = new CallbackProperty(function () {
        return position
      }, false)

      positionObj = this._drawLayer.entities.add(_poiEntity)
    }
  },
}

