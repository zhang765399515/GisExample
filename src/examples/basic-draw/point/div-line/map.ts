import Label from './label.vue';
import { Cartesian3, Cartesian2, SceneTransforms ,ScreenSpaceEventHandler,ScreenSpaceEventType} from 'geokey-gis';
import { createApp, createVNode, render } from 'vue';

export class DivLabel {
  constructor(
    val: {
      height: number;
      lon: number;
      lat: number;
      name: number;
    },
    id: number
  ) {
    this.height = val.height;
    this.position = Cartesian3.fromDegrees(val.lon, val.lat, val.height);
    let title = val.name;
    let div = document.createElement("div");
    div.className = 'div-label'
    window.viewer.geokeyWidget.container.appendChild(div); //将字符串模板生成的内容添加到DOM上
    this._vnode = createVNode(Label, {
      title,
      id
    });
    render(this._vnode, div);
    this.addPostRender();
  }

  height: number;

  position: Cartesian3;

  _vnode: any;

  //添加场景事件
  addPostRender() {
    window.viewer.scene.postRender.addEventListener(this.postRender, this);
  }

  //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
  postRender() {
    if (!this._vnode.el || !this._vnode.el.style) return;

    const canvasHeight = window.viewer.scene.canvas.height;
    const windowPosition = new Cartesian2();

    SceneTransforms.wgs84ToWindowCoordinates(window.viewer.scene, this.position, windowPosition);

    this._vnode.el.style.bottom = canvasHeight - windowPosition.y + this.height + 'px';
    const elWidth = this._vnode.el.offsetWidth;
    this._vnode.el.style.left = windowPosition.x - elWidth / 2 + 'px';

    const camerPosition = window.viewer.camera.position;
    let height = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
    height += window.viewer.scene.globe.ellipsoid.maximumRadius;
    if (!(Cartesian3.distance(camerPosition, this.position) > height) && window.viewer.camera.positionCartographic.height < 50000) {
      this._vnode.el.style.display = 'block';
    } else {
      this._vnode.el.style.display = 'none';
    }
  }

}
export function flyTo(lon: number,lat: number){
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(lon,lat,3000),
  })
}
export function removeDiv() {
  let data = window.viewer.geokeyWidget.container.getElementsByClassName("div-label");
  for (let i = data.length - 1; i >= 0; i--) {
    window.viewer.geokeyWidget.container.removeChild(data[i])
  }
}
export function leftClick(){
  let handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  handler.setInputAction(evt=> {
            var pick = window.viewer.scene.pick(evt.position);
            console.log('name：pick',pick);

        }, ScreenSpaceEventType.LEFT_CLICK);
}
export default DivLabel;