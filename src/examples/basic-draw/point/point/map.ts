import { Color, Cartesian3, Entity, EventDriven,ScreenSpaceEventHandler,ScreenSpaceEventType,CMath,Cartographic,HorizontalOrigin,VerticalOrigin } from 'geokey-gis';

let pointPosition = undefined;
export const pointEntityArr: Entity[] = [];

let lineArr = [];

export function loadEntityPoint() {
  const handler = new EventDriven(window.viewer);
  handler.addEvent('LEFT_CLICK', (e: any) => {
    if (e.cartesian) {
      addPoint(e.cartesian);
    }
  });

  handler.addEvent('RIGHT_CLICK', (e: any) => {
    handler.removeEvent('LEFT_CLICK');
  });

  window.viewer.scene.renderError.addEventListener((scene, error) => {
    if (error) {
      console.log('error: ', error);
    }
  });
}
function addPoint(position: Cartesian3) {
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  const pointEntity = window.viewer.entities.add({
    name: 'point',
    position: position,
    point: {
      color: Color.fromCssColorString('#67F708'),
      pixelSize: 4,
      outlineColor: Color.fromCssColorString('#67F708'),
      outlineWidth: 1,
      disableDepthTestDistance: 5000000
    },
    // label: {
    //   text: '测试'
    // }
  });
  pointEntityArr.push(pointEntity);
  window.viewer.scene.globe.depthTestAgainstTerrain = false;
}

function editPoint() {}

// DrawPoint
/*
绘制点
 */
export class DrawPoint {
  constructor(option) {
      // this.callback = option.callback;
      this._point = null;  //最后一个点
      this._pointData = null;//点数据
      this._entities = []; //数据集合
  }

  //返回最后活动点
  get point() {
      return this._point;
  }

  //加载点
  loadPoint(cartesian,data) {
      return this.createPoint(cartesian,data);
  }

  //返回点数据用于加载点
  getData() {
      return this._pointData;
  }

  //开始绘制
  startCreate(options,callback) {
      var $this = this;
      if(this._entities){
        this.clear();
      }
      this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
      this.handler.setInputAction((evt)=> { //单机开始绘制
          var cartesian = $this.getCatesian3FromPX(evt.position);
          if (!cartesian) return;
          var point = $this.createPoint(cartesian,options);
          $this._pointData = cartesian;
          $this._point = point;
          if(typeof callback=="function"){
              callback(this.Catesian3To84(cartesian),point);
          }
      }, ScreenSpaceEventType.LEFT_CLICK);
  }

  //创建点
  createPoint(cartesian,options) {
      var $this = this;
      var point = window.viewer.entities.add({
          position: cartesian,
          point: {
              pixelSize: options.size || 10,
              color: Color.fromCssColorString(options.color) || Color.YELLOW,
              outlineWidth:options.isOutLine == true ? options.outlineWidth : 0,
              outlineColor:Color.fromCssColorString(options.outlineColor) || Color.YELLOW,
              disableDepthTestDistance:options.isDisableDepthTestDistance ? 5000000 : 0
          },
          label:{
            show:options.isLabel,
            text:options.name,
            font: `${options.fontSize}px sans-serif`,
            fillColor: Color.fromCssColorString(options.fontColor) || Color.WHITE,
            horizontalOrigin: options.horizontalOrigin == "居中" ? HorizontalOrigin.CENTER : options.horizontalOrigin == "居右" ? HorizontalOrigin.RIGHT : HorizontalOrigin.LEFT,
            verticalOrigin: options.verticalOrigin == "居中" ? VerticalOrigin.CENTER : options.verticalOrigin == "居上" ? VerticalOrigin.TOP : VerticalOrigin.BOTTOM,
            disableDepthTestDistance:options.isDisableDepthTestDistance ? 5000000 : 0
          }
      });
      $this._entities.push(point); //加载脏数据
      $this.destroy();
      return point;
  }
  modifyPoint(pointData){
  console.log('name：pointData',pointData);
    let entities = this._entities[0];
    if(entities){
      entities.position = Cartesian3.fromDegrees(pointData.location.longitude,pointData.location.latitude,pointData.location.height);
      entities.point.color = Color.fromCssColorString(pointData.color);
      entities.point.pixelSize = pointData.size;
      entities.point.outlineWidth = pointData.isOutLine == true ? pointData.outlineWidth : 0;
      entities.point.outlineColor = Color.fromCssColorString(pointData.outlineColor);
      entities.point.disableDepthTestDistance = pointData.disableDepthTestDistance ? 5000000 : 0;
      entities.label.show = pointData.isLabel;
      entities.label.text = pointData.name;
      entities.label.font = `${pointData.fontSize}px sans-serif`;
      entities.label.fillColor = Color.fromCssColorString(pointData.fontColor);
      entities.label.outlineColor = Color.fromCssColorString(pointData.outlineColor);
      entities.label.horizontalOrigin = pointData.horizontalOrigin == "居中" ? HorizontalOrigin.CENTER : pointData.horizontalOrigin == "居右" ? HorizontalOrigin.RIGHT : HorizontalOrigin.LEFT;
      entities.label.verticalOrigin = pointData.verticalOrigin == "居中" ? VerticalOrigin.CENTER : pointData.verticalOrigin == "居上" ? VerticalOrigin.TOP : VerticalOrigin.BOTTOM;
      entities.label.disableDepthTestDistance = pointData.disableDepthTestDistance ? 5000000 : 0;
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
      this._point = null;
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

