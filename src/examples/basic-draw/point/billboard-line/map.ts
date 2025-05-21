import { 
  Color, 
  Cartesian3,
  Entity, 
  EventDriven,
  BillboardCollection , 
  DistanceDisplayCondition , 
  NearFarScalar,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  VerticalOrigin,
  HorizontalOrigin,
  Cartesian2,
} from 'geokey-gis';
export class loadPrimitiveDiv2{
  constructor(option){
    this.primitives_name = option.name;
    this.imgUrl = option.imgUrl || '/image/popbg.png';//背景图片
    this.drillData = [];
    this.billboards = null;
    this.handler = null;
    this.imagesLoaded = 0;
    this.canvasStyle = {
      color: option.color,//主题色
      fontColor:option.fontColor,//文字颜色
      backgroundColor:option.backgroundColor
    }
  }
  /**
     * 获取文本宽度
     * @param {Object} ctx // CanvasRenderingContext2D
     * @param {String} text // 文本内容
     */
  getFontWidth(fonSize, fontFace, ctx, text) {
    ctx.font = fonSize + 'px ' + fontFace
    let txtWidth = 0
    for (let i = 0; i < text.length; i++) {
      txtWidth += ctx.measureText(text[i]).width
    }
    return txtWidth
  }
  loadCanvas(text, img,height,canvasStyle){
    var canvas = document.createElement('canvas');
    canvas.height = 90;
      var ctx = canvas.getContext('2d');
      let txtWidth = this.getFontWidth(16, 'Arial', ctx, text)
      canvas.width = txtWidth + 60;
      ctx.fillStyle = canvasStyle.backgroundColor; //背景
      ctx.fillRect(40, 0, canvas.width, 40);//设置文本框大小
      // 绘制文字
      ctx.fillStyle = canvasStyle.fontColor;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(text,50, 25);
      //设置下边框
      ctx.strokeStyle = canvasStyle.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 39, canvas.width, 1);

      //绘制斜线
      ctx.strokeStyle = canvasStyle.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.lineJoin="round";
      ctx.moveTo(10,80);
      ctx.lineTo(40,40);
      ctx.stroke();

      //绘制点
      ctx.strokeStyle = canvasStyle.color;
      ctx.lineWidth = 5;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(10, 80, 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, 80, 4, 0, 2 * Math.PI); 
      ctx.fill();
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
        let result = this.loadCanvas(textData[i].name, img[0],textData[i].height,this.canvasStyle)
        let entities = window.viewer.entities.add({
          position:Cartesian3.fromDegrees(textData[i].lon,textData[i].lat,textData[i].height),
          model:{
            uri:'/model/drilling/1.gltf',
            scale:2,
            minimumPixelSize:2,
            maximumScale:4,
            distanceDisplayCondition:new DistanceDisplayCondition(10, 20000),
          },
          // billboard: {
          //   image: result,
          //   disableDepthTestDistance:5000000,
          //   horizontalOrigin: HorizontalOrigin.LEFT,
          //   verticalOrigin: VerticalOrigin.BOTTOM,
          //   // pixelOffset: new Cartesian2(0,-40)
          // },
        })

        let b = billboardList.add({
          position : Cartesian3.fromDegrees(textData[i].lon,textData[i].lat,textData[i].height+5),
        });
        b.name = textData[i].name;
        b.distanceDisplayCondition = new DistanceDisplayCondition(10, 20000);
        b.scaleByDistance = new NearFarScalar(10, 1, 20000, 0.6);
        b.horizontalOrigin = HorizontalOrigin.LEFT;
        b.verticalOrigin = VerticalOrigin.BOTTOM;
        b.disableDepthTestDistance = 5000000
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
