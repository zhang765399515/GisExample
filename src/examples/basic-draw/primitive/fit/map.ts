import { ClassificationType, primitiveSymbol, SinglePicker } from 'geokey-gis';

export function drawFltPolygon() {
  const options = {
    ranges: [105, 29, 107, 29, 107, 28, 105, 28], //坐标范围
    id: JSON.stringify({ name: '这个面贴于倾斜摄影表面', id: '12345' }),
    color: 'rgba(255, 255, 0, 0.8)',
    class: ClassificationType.BOTH // 同时贴于地面与倾斜摄影上，不定义该项则只贴于倾斜摄影
  };
  const primitive = primitiveSymbol(options as any);

  window.viewer.map.add(primitive);

  const singlepicker = new SinglePicker({
    viewer: window.viewer,
    clickPick: {
      color: 'red',
      success: function (feature: any) {
        console.log(feature);
      },
      error: function () {
        console.warn('null');
      }
    }
  });
}
