/*
 * @Author: lifengjiao 284802023@qq.com
 * @Date: 2023-12-28 15:18:18
 * @LastEditors: lifengjiao 284802023@qq.com
 * @LastEditTime: 2023-12-29 16:10:33
 * @FilePath: \vite-pgEarth\src\examples\dynamic\analysis\graphics-cluster\map.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { WindGlobe } from "geokey-gis";
import Windy from './Windy';
import data from './gfs.json';
let windy: any;
let started: any;
let moveStart: any;
let moveEnd: any;
export function primitivesWind() {
  window.viewer.scene.requestRenderMode = false;//开启动态水面
  window.windGlobe = new WindGlobe(window.viewer)
  // window.pgEarthGlobe = new global(window.viewer);
  let dom = document.createElement('canvas')
  dom.id = 'wind'
  dom.className = 'windy'
  document.body.append(dom)
  windy = Windy({ canvas: document.getElementById("wind"), data: data });
  redraw();
  moveStart = () => {
    console.log("move start...");
    let dom = document.getElementById("wind");
    dom && (dom.style.display = 'none')
    if (!!windy && started) {
      windy.stop();
    }
  }
  window.viewer.camera.moveStart.addEventListener(moveStart);
  moveEnd = () => {
    let dom = document.getElementById("wind");
    dom && (dom.style.display = 'none')
    if (!!windy && started) {
      redraw();
    }
  }
  window.viewer.camera.moveEnd.addEventListener(moveEnd);


}
export function redraw() {
  let dom: any = document.getElementById("wind")
  let width = window.viewer.canvas.width;
  let height = window.viewer.canvas.height;
  dom && (dom.width = width);
  dom && (dom.height = height);
  windy.stop();
  started = windy.start(
    [[0, 0], [width, height]],
    width,
    height
  );
  dom && (dom.style.display = 'block');
}