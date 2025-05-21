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
    Cartesian2,
    defined,
    CallbackProperty,
  } from 'geokey-gis';
  
  /*
  绘制线
   */
  export class DrawPolyline {
    constructor(option) {
        this.callback=option.callback;
        this._polyline = null; //活动线
        this._polylineLast = null; //最后一条线
        this._positions = [];  //活动点
        this._entities_point = [];  //点集合
        this._entities_line = [];  //线集合
        this._polylineData = null; //用于构造线数据
    }
  
    //返回最后活动线
    get line() {
        return this._polylineLast;
    }
  
    //返回线数据用于加载线
    getData() {
        return this._polylineData;
    }
    getPointData(){
      return this._positions;
    }
    //加载线
    loadPolyline(data) {
        var $this = this;
        var polyline = window.viewer.entities.add({
            polyline: {
                positions: data,
                show: true,
                material: Color.RED,
                width: 3,
                // clampToGround: true
            }
        });
        return polyline;
    }
  
    //开始创建
    startCreate(otherData,callback) {
        // window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
        // window.viewer.scene.requestRenderMode = false; // 开启实时刷新
        var $this = this;
        this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
            }
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
        }, ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制线
            if ($this._positions.length < 1) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!defined($this._polyline)) {
                $this._polyline = $this.createPolyline(otherData);
            }
            if ($this._polyline) {
              $this._positions.pop();
              $this._positions.push(cartesian);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._polyline) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
            $this._polylineData = $this._positions.concat();
            window.viewer.entities.remove($this._polyline); //移除
            $this._polyline = null;
            $this._positions = [];
            var line = $this.loadPolyline($this._polylineData); //加载线
            $this._entities_line.push(line);
            $this._polylineLast=line;
            if(typeof callback=="function"){
              callback($this._polylineData);
            }
        }, ScreenSpaceEventType.RIGHT_CLICK);
    }
  
    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = window.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: Color.YELLOW,
            }
        });
        $this._entities_point.push(point);
        return point;
    }
  
    //创建线
    createPolyline(otherData) {
        var $this = this;
        var polyline = window.viewer.entities.add({
            polyline: {
                positions: new CallbackProperty(()=> {
                    return $this._positions
                }, false),
                show: true,
                material: Color.fromCssColorString(otherData.color) || Color.RED,
                width: otherData.width,
                // clampToGround: true
            }
        });
        $this._entities_line.push(polyline);
        return polyline;
    }
    modifyPolyline(otherData){
      let entities = this._entities_line[this._entities_line.length - 1];
      if(entities){
        entities.polyline.material = Color.fromCssColorString(otherData.color) || Color.RED;
        entities.polyline.width = otherData.width;
      }
    }
    //销毁
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }
  
    //清空实体对象
    clear() {
        for (var i = this._entities_point.length - 1; i >= 0 ; i--) {
            window.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = this._entities_line.length - 1; i >= 0 ; i--) {
            window.viewer.entities.remove(this._entities_line[i]);
        }
        this._polyline = null;
        this._positions = [];
        this._entities_point = [];  //脏数据
        this._entities_line = [];  //脏数据
        this._polylineData = null; //用于构造线数据
        this._polylineLast=null;
        this.destroy();
    }
  
    getCatesian3FromPX(px) {
        var cartesian;
        var ray = window.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
        return cartesian;
    }
  }
  
  export default DrawPolyline
  