import { Color, GeokeyTerrainProvider, ElevationGradientLayer } from 'geokey-gis';

export function loadElevationGrandientLayer() {
  let elevationLayer = new GeokeyTerrainProvider({
    url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=sz_dem',
    requestWaterMask: false,
    requestVertexNormals: true
  });

  window.viewer.map.ground.layer.add(elevationLayer);
  function setUpElevationGradient() {
    let eleLayer = new ElevationGradientLayer({
      id: 'myLayer',
      viewer: window.viewer,
      gridSize: 65, // 格网大小 默认是65
      majorContour: 25, // 主等高线间距
      minorContour: 5, // 次等高线间距
      contourColor: Color.RED, // 等高线颜色
      gradientAmount: true, // 是否显示高度热力, 默认显示
      contourAmount: true, // 是否显示等高线
      formatContourLabel: (value: any) => {
        return `${value.toFixed(2)} m`;
      }, // 定义高度值显示格式
      minimumTileLevel: 12, // 最小显示层级，默认是10
      gradient: [
        // 梯度变化颜色
        {
          color: {
            // 颜色值的范围为(0,1),即为rgb/255
            red: 39 / 255,
            green: 71 / 255,
            blue: 224 / 255,
            alpha: 0.8
          },
          value: 100 //高度值 蓝色
        },
        {
          color: {
            red: 66 / 255,
            green: 255 / 255,
            blue: 72 / 255,
            alpha: 0.8
          },
          value: 300 //高度值 绿色
        },
        {
          color: {
            red: 255 / 255,
            green: 165 / 255,
            blue: 0 / 255,
            alpha: 0.8
          },
          value: 600 //高度值 橙色
        },
        {
          color: {
            red: 1,
            green: 0,
            blue: 0,
            alpha: 0.8
          },
          value: 1000 //高度值 红色(1,0,0)
        }
      ]
    });
    let imageryLayer = window.viewer.map.add(eleLayer);

    // 更改透明度
    imageryLayer.alpha = 1.0;
  }
  setTimeout(function () {
    setUpElevationGradient();
  }, 5000);
}
