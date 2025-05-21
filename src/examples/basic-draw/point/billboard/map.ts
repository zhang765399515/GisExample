import { Color, Cartesian3, Entity, EventDriven,BillboardCollection , DistanceDisplayCondition , NearFarScalar,ScreenSpaceEventHandler,ScreenSpaceEventType} from 'geokey-gis';
export class loadPrimitiveDiv2{
  constructor(option){
    this.primitives_name = option.name;
    this.imgUrl = option.imgUrl || '/image/popbg.png';//背景图片
    this.drillData = [];
    this.billboards = null;
    this.handler = null;
    this.imagesLoaded = 0;
  }
  loadCanvas(text, img){
    var canvas = document.createElement('canvas');
    canvas.height = 50;
    var ctx = canvas.getContext('2d');
      // 加载背景图片
      // 在canvas上绘制背景图片
      var metrics = ctx.measureText(text);
      var textWidth = metrics.width;
      canvas.width = textWidth * 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 绘制文字
      ctx.font = 'bold 14px 微软雅黑';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.fillText(text,textWidth / 4, 30);
      return canvas
  }
  /**
   * 
   * @param textData 生成容器的数据
   * @param name 需要绑定的名称字段名
   * @param _value 需要绑定的值字段名
   */
  addBillboards(textData){
    this.preloadImages([this.imgUrl]).then(img=>{
      const billboardList = new BillboardCollection()
      for (let i = 0; i < textData.length; i++) {
        let result = this.loadCanvas(textData[i].name, img[0])
        let b = billboardList.add({
          position : Cartesian3.fromDegrees(textData[i].lon,textData[i].lat,textData[i].height),
        });
        b.name = textData[i].name;
        b.distanceDisplayCondition = new DistanceDisplayCondition(10, 50000);
        b.scaleByDistance = new NearFarScalar(10, 1, 50000, 0.6)
        b.setImage('drill'+i , result)
        this.drillData.push(b)
      }
      this.billboards = window.viewer.scene.primitives.add(billboardList);
      this.leftEvent();
    })
  }
  /**
   * 左击事件
   */
  leftEvent(){
    this.handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    this.handler.setInputAction((movement)=> {
      var pickedObject = window.viewer.scene.pick(movement.position);  
      return pickedObject && pickedObject.primitive
  },ScreenSpaceEventType.LEFT_CLICK)
  }
  /**
   * 移除所有数据
   * @param name 集合名称
   */
  removeAll(name){
    window.viewer.scene.primitives.remove(this.billboards);
    this.handler && this.handler.removeInputAction(this.handler.getInputAction(ScreenSpaceEventType.LEFT_CLICK));
  }
  /**
   * 
   * @param name 移除单个
   */
  removeBillBoards(name){
    for (let i = 0; i < this.billboards.length; i++) {
      var billboard = this.billboards.get(i);
      if(billboard.name == name){
        this.billboards.remove(billboard)
      }
    }
    // this.handler.removeInputAction(this.handler.getInputAction(ScreenSpaceEventType.LEFT_CLICK));
  }

  preloadImages(images) {
    return Promise.all(images.map((src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img); // 当图片加载完成时解决Promise
      img.onerror = reject; // 当图片加载出错时拒绝Promise
      img.src = src; // 开始加载图片
    })));
  }
}
export function flyTo(lon: number,lat: number){
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon,lat,3000),
  })
}
