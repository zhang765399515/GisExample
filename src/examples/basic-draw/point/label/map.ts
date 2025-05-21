import { 
  Color, 
  Cartesian3, 
  Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  CMath,
  Cartographic,
  HorizontalOrigin,
  VerticalOrigin,
  Cartesian2 
} from 'geokey-gis';

let pointPosition = undefined;
export const pointEntityArr: Entity[] = [];
/*
绘制文本
 */
export class DrawLabel {
  constructor(option) {
      // this.callback = option.callback;
      this._label = null;  //最后一个文本
      this._labelData = null;//文本数据
      this._entities = []; //数据集合
  }

  //返回最后活动文本
  get point() {
      return this._label;
  }

  //加载文本
  loadPoint(cartesian,data) {//坐标，属性
      return this.createLabel(cartesian,data);
  }

  //返回文本数据用于加载文本
  getData() {
      return this._labelData;
  }

  //开始绘制
  startCreate(otherData,callback) {
      var $this = this;
      if(this._entities){
        this.clear();
      }
      this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
      this.handler.setInputAction((evt)=> { //单机开始绘制
          var cartesian = $this.getCatesian3FromPX(evt.position);
          if (!cartesian) return;
          var point = $this.createLabel(cartesian,otherData);
          $this._labelData = cartesian;
          $this._label = point;
          if(typeof callback=="function"){
              callback(this.Catesian3To84(cartesian));
          }
      }, ScreenSpaceEventType.LEFT_CLICK);
  }

  //创建文本
  createLabel(cartesian,otherData) {
      var $this = this;
      var point = window.viewer.entities.add({
          position: cartesian,
          label:{
            text:otherData.name,
            font: `${otherData.fontSize}px sans-serif`,
            fillColor: Color.fromCssColorString(otherData.fontColor) || Color.WHITE,
            outlineColor: Color.fromCssColorString(otherData.fontColor) || Color.WHITE,
            horizontalOrigin: otherData.horizontalOrigin == "居中" ? HorizontalOrigin.CENTER : otherData.horizontalOrigin == "居右" ? HorizontalOrigin.RIGHT : HorizontalOrigin.LEFT,
            verticalOrigin: otherData.verticalOrigin == "居中" ? VerticalOrigin.CENTER : otherData.verticalOrigin == "居上" ? VerticalOrigin.TOP : VerticalOrigin.BOTTOM,
            disableDepthTestDistance:500000,
            showBackground:otherData.showBackground,
            backgroundColor:Color.fromCssColorString(otherData.backgroundColor) || "rgba(0,0,0,0.5)",
            backgroundPadding: new Cartesian2(otherData.paddingLeft,otherData.paddingTop)
          }
      });
      $this._entities.push(point); //加载脏数据
      $this.destroy();
      return point;
  }
  modifyLabel(pointData){
    let entities = this._entities[0];
    if(entities){
      entities.position = Cartesian3.fromDegrees(pointData.location.longitude,pointData.location.latitude,pointData.location.height);
      entities.label.text = pointData.name;
      entities.label.font = `${pointData.fontSize}px sans-serif`;
      entities.label.fillColor = Color.fromCssColorString(pointData.fontColor);
      entities.label.outlineColor = Color.fromCssColorString(pointData.fontColor);
      entities.label.horizontalOrigin = pointData.horizontalOrigin == "居中" ? HorizontalOrigin.CENTER : pointData.horizontalOrigin == "居右" ? HorizontalOrigin.RIGHT : HorizontalOrigin.LEFT;
      entities.label.verticalOrigin = pointData.verticalOrigin == "居中" ? VerticalOrigin.CENTER : pointData.verticalOrigin == "居上" ? VerticalOrigin.TOP : VerticalOrigin.BOTTOM;
      entities.label.showBackground = pointData.showBackground,
      entities.label.backgroundColor = Color.fromCssColorString(pointData.backgroundColor) || "rgba(0,0,0,0.5)",
      entities.label.backgroundPadding = new Cartesian2(pointData.paddingLeft,pointData.paddingTop)
    }
  }
  //销毁鼠标事件
  destroy() {
      if (this.handler) {
          this.handler.destroy();
          this.handler = null;
      }
  }

  //清空实体对象
  clear() {
      for (var i = this._entities.length - 1; i >= 0; i--) {
          window.viewer.entities.remove(this._entities[i]);
      }
      this._entities = [];
      this._label = null;
  }

  getCatesian3FromPX(px) {
      var cartesian;
      var ray = window.viewer.camera.getPickRay(px);
      if (!ray) return null;
      cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      return cartesian;
  }
  Catesian3To84(cartesian){
    var cartographicPosition = Cartographic.fromCartesian(cartesian);
    var longitude = CMath.toDegrees(cartographicPosition.longitude);
    var latitude = CMath.toDegrees(cartographicPosition.latitude);
    var height = cartographicPosition.height;
    return { longitude: longitude,latitude: latitude,height: height}
  }
}

