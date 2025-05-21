import { ref } from 'vue';
import { CMath, Cartesian3, Entity, ScreenSpaceEventType, ScreenSpaceEventHandler } from "geokey-gis";

const viewContainer: Element = document.querySelector('#basemap') as Element;

interface menuType {
  text: string;
  type?: string;
  children?: menuType[];
  show?: any;
  callback?: any;
}

const eText: menuType[] = [
  {
    text: '查看此处坐标',
    type: 'longlat',
    callback: function (e?: any) {
      alert(111)
    }
  },
  {
    text: '开启深度监测',
    type: 'opendepth',
    show: function () {
      return !window.viewer.scene.globe.depthTestAgainstTerrain;
    },
    callback: function (e?: any) {
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
    }
  },
  {
    text: '关闭深度监测',
    type: 'closedepth',
    show: function () {
      return window.viewer.scene.globe.depthTestAgainstTerrain;
    },
    callback: function (e?: any) {
      window.viewer.scene.globe.depthTestAgainstTerrain = false;
    }
  },
  {
    text: '查看当前视角',
    type: 'firstperspective',
    children: [
      {
        text: '移动到此处',
        show: 'flyToForContextmenuShow',
        callback: 'flyToForContextmenuClick' // 也支持“方法名称”方式(如config.json中配置时)
      }
    ]
  }
];
let positionObj;
let entitiesId: string;

export function loadRightClick() {
  const Handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
  Handler.setInputAction(function (e: any) {
    const cartesian = window.viewer.camera.pickEllipsoid(e.position, window.viewer.scene.globe.ellipsoid);
    if (cartesian) {
      // 苗卡尔椭球体的三维坐标 转 地图坐标（弧度）
      const cartographic = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      // 地图坐标（弧度） 转 十进制度数 toFixed保留小数点后几位
      let longitude = CMath.toDegrees(cartographic.longitude).toFixed(8); //经度
      let latitude = CMath.toDegrees(cartographic.latitude).toFixed(8); //纬度
      let altitude = (window.viewer.camera.positionCartographic.height / 1000).toFixed(2); //视角高
      let elevation = (window.viewer.scene.globe.getHeight(cartographic) as any).toFixed(4); //海拔
      positionObj = { longitude, latitude, altitude, elevation };
    }
    // 判断点击位置是否有实体
    var pickedObject = window.viewer.scene.pick(e.position);

    if (pickedObject == undefined) {
      loadUl(e.position);
    } else {
      if (pickedObject.tileset != undefined && pickedObject.tileset.type == '3dtiles') {
        loadUl(e.position, pickedObject.tileset.contextmenuItems, '3dtiles');
      } else {
        entitiesId = pickedObject.id._id;
        // 判断实体
        const entity: any = window.viewer.entities.getById(entitiesId);
        if (entity != undefined) {
          var type = '';
          if (entity.billboard != undefined) {
            type = 'billboard';
          }
          if (entity.polygon != undefined) {
            type = 'polygon';
          }
          if (entity.polyline != undefined) {
            type = 'polyline';
          }
          loadUl(e.position, entity._contextmenuItems, type);
        }
      }
    }
  }, ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 * 右键点击html
 * @params {object} screen 屏幕坐标对象｛x:122,y:444｝
 * @params {object} textArr 渲染文本数组对象
 * @params {string} type 实体类型 undefined：空白区域
 */
function loadUl(screen: any, textArr?: any[], type?: string) {
  let menuContext = '';
  let items = '';
  if (textArr != undefined && type != undefined) {
    for (var i = 0; i < textArr.length; i++) {
      items += `<li class="pgEarth-menu-item" data-index="20"><a href="javascript:${textArr[i].callback()}" >${textArr[i].text}</a></li>`;
    }
  } else {
    const terrainStatus = window.viewer.scene.globe.depthTestAgainstTerrain;
    for (var i = 0; i < eText.length; i++) {
      if (terrainStatus) {
        if (eText[i].type == 'opendepth') {
          continue;
        }
      } else {
        if (eText[i].type == 'closedepth') {
          continue;
        }
      }
      items += `<li class="pgEarth-menu-item" data-index="20">
                  <a href="javascript:void(0);" rel="external nofollow" rel="external nofollow" οnclick="${typeof eText[i].callback === 'function' && eText[i].callback()}">${eText[i].text}</a>
                </li>`;
    }
  }
  menuContext = `<ul class="pgEarth-context-menu">${items}</ul>`;
  const divs = document.querySelectorAll('.pgEarth-context-main');
  if (divs.length != 0) {
    viewContainer.removeChild(divs[0]);
  }
  const div = document.createElement('div');
  div.className = 'pgEarth-context-main';
  div.style.top = screen.y + 32 + 'px';
  div.style.left = screen.x + 'px';
  div.style.position = 'fixed';
  div.innerHTML = menuContext;
  viewContainer.append(div);
}

// function doProhibit() {
//   if (window.Event && window.captureEvents) window.captureEvents(Event.MOUSEUP);

//   function nocontextmenu() {
//     event.cancelBubble = true;
//     event.returnvalue = false;
//     return false;
//   }

//   function norightclick(e) {
//     if (window.Event) {
//       if (e.which == 2 || e.which == 3) return false;
//     } else if (event.button == 2 || event.button == 3) {
//       event.cancelBubble = true;
//       event.returnvalue = false;
//       return false;
//     }
//   }
//   document.oncontextmenu = nocontextmenu; // for IE5+
//   document.onmousedown = norightclick; //
// }

// doProhibit();

(window as any).rightliClick = function (type: string) {
  const divs = document.querySelectorAll('.pgEarth-context-main');
  viewContainer.removeChild(divs[0]);
  switch (type) {
    case 'longlat':
      alert('F12 Console latObj:');
      break;
    case 'opendepth':
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
      break;
    case 'closedepth':
      window.viewer.scene.globe.depthTestAgainstTerrain = false;
      break;
    case 'firstperspective':
      flyToSatrt();
      break;
    case 'cesiumObj':
      var entity = window.viewer.entities.getById(entitiesId);
      if (entity != undefined) {
        window.viewer.entities.remove(entity);
      }
      break;
  }
};

function flyToSatrt() {
  window.viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(117.224601, 31.808241, 4071.32),
    orientation: {
      heading: CMath.toRadians(356.7),
      pitch: CMath.toRadians(-61),
      roll: 0.0
    }
  });
}
