import { MigrateChart } from "geokey-gis";

const points: Array<Array<number>> = [];

for (var i = 0; i < 50; i++) {
  points.push([100 + Math.random() * 30, 25 + Math.random() * 30]);
}

export function widgetsMigraeChartline() {
  const options = {
    viewer: window.viewer,
    center: [110.540545, 39.531714],
    points: points,
    height: 0,
    direction: false, //迁徙图移动的方向 默认扩散迁移
    centerPointStyle: {
      //中心点样式
      color: 'red',
      size: 24
    },
    endPointStyle: {
      //各终点样式
      color: '#87ddf6',
      size: 8
    },
    lineStyle: {
      //路径样式
      color: '#87ddf6',
      size: 1
    },
    pointStyle: {
      //闪烁点样式
      color: '#87ddf6',
      size: 5
    }
  };

  const migChart = new MigrateChart(options);
}
