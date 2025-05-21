
import { EventDriven, ScreenSpaceEventHandler, ScreenSpaceEventType, Ray, Ellipsoid, Cartesian3, CMath } from 'geokey-gis';
import { reactive } from 'vue';
import Tooltip from "@/components/baseMap/common/util/tooltip";
import { bearing, destination, lineString, lineOffset, bezierSpline, booleanPointInPolygon, polygon, point, nearestPointOnLine } from "@turf/turf";
export const gltfList = reactive([
    {
        name: 'j轿车',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/jiaoche.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/jiaoche.gltf',
        isCall: true
    },
    {
        name: '货车',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/huoche.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/huoche.gltf',
        isCall: false
    },
    {
        name: '高层住宅',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/gczz.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/gczz.gltf',
        isCall: false
    },
    {
        name: '梧桐树',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/wts.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/wts.gltf',
        isCall: false
    },
    {
        name: '松树',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/songshu.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/songshu.gltf',
        isCall: false
    },
    {
        name: '工人',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/gongren.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/gongren.gltf',
        isCall: false
    },
    {
        name: '路灯',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/ludeng.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/ludeng.gltf',
        isCall: false
    },
    {
        name: 'GNSS',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/gnss.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/gnss_001.gltf',
        isCall: false
    },
    {
        name: '雨量计',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/ylj.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/ylj.gltf',
        isCall: false
    },
    {
        name: '倾斜仪',
        imgUrl: 'http://gis.igeokey.com:12025/moxing/img/qxy.png',
        gltfUrl: 'http://gis.igeokey.com:12025/moxing/gltf/qxy.gltf',
        isCall: false
    }
])
let pitchOn = ['http://gis.igeokey.com:12025/moxing/gltf/jiaoche.gltf'];
let tooltip: Tooltip, mouseMove: any, isDraw: boolean = false, leftClickDraw: any, pointLonLat: any, lineLonLat: any;
// tooltip = new Tooltip((window.viewer as any)._element);
export function startPlanningLine(gltfObj: object) {
    if (pitchOn.length == 0) return;
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度拾取
    window.viewer.scene.requestRenderMode = false; // 开启实时刷新
    document.getElementById("basemap")!.style.cursor = "crosshair"; //鼠标变为点击状态
    // 鼠标移动事件
    // mouseMove = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    // mouseMove.setInputAction(function (movement: any) {
    //     if (movement.x < 200 && movement.y < 150) { tooltip.setVisible(false); return; }
    //     if (isDraw) { tooltip.showAt( movement.endPosition,  "<p>右键单击结束绘制</p>" ); } 
    //     else { tooltip.showAt( movement.endPosition, "<p>左键点击绘制</p>" ); }
    // }, ScreenSpaceEventType.MOUSE_MOVE);
    // 左键点击事件
    leftClickDraw = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
    leftClickDraw.setInputAction(function (movement: any) {
        isDraw = true;
        clickArr(movement);
    }, ScreenSpaceEventType.LEFT_CLICK);
}

// 经纬度获取
function clickArr(movement: any) {
    const ray = window.viewer.scene.camera.getPickRay(movement.position);
    const cartesian = window.viewer.scene.globe.pick((ray as Ray), window.viewer.scene);
    const position1 = Ellipsoid.WGS84.cartesianToCartographic((cartesian as Cartesian3));
    const result = {
        longitude: CMath.toDegrees(position1.longitude),
        latitude: CMath.toDegrees(position1.latitude),
        height: position1.height,
    };
    pointLonLat.push(result);
}

// 图片的选中
export function gltfImg(_index: any) {
    let is: boolean = gltfList[_index].isCall;
    gltfList[_index].isCall = !is;
    gltfList[_index].isCall && pitchOn.push(gltfList[_index].gltfUrl)
    !gltfList[_index].isCall && (pitchOn = pitchOn.filter(item => item != gltfList[_index].gltfUrl));
}
