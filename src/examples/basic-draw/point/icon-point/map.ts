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

let billboardPosition = undefined;
export const billboardEntityArr: Entity[] = [];
/*
绘制点
 */
export class DrawBillboard {
  constructor(option) {
      // this.callback = option.callback;
      this._billboard = null;  //最后一个点
      this._billboardData = null;//点数据
      this._entities = []; //数据集合
  }

  //返回最后活动点
  get billboard() {
      return this._billboard;
  }

  //加载点
  loadbillboard(data) {
      return this.createLabel(data);
  }

  //返回点数据用于加载点
  getData() {
      return this._billboardData;
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
          var billboard = $this.createLabel(cartesian,otherData);
          $this._billboardData = cartesian;
          $this._billboard = billboard;
          if(typeof callback=="function"){
              callback(this.Catesian3To84(cartesian));
          }
      }, ScreenSpaceEventType.LEFT_CLICK);
  }

  //创建点
  createLabel(cartesian,otherData) {
      var $this = this;
      var billboard = window.viewer.entities.add({
          position: cartesian,
          billboard:{
            image:otherData.image,
            scale:otherData.scale
          }
      });
      $this._entities.push(billboard); //加载脏数据
      $this.destroy();
      return billboard;
  }
  modifyLabel(billboardData){
    let entities = this._entities[0];
    if(entities){
      entities.position = Cartesian3.fromDegrees(billboardData.location.longitude,billboardData.location.latitude,billboardData.location.height);
      entities.billboard.image = billboardData.image;
      entities.billboard.scale = billboardData.scale;
     
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
      this._billboard = null;
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

