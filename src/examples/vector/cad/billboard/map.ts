import Mx from 'mxdraw';

export function loadCADDialog() {
  
  Mx.loadCoreCode().then(() => {
    // 创建控件对象
    Mx.MxFun.createMxObject({
      canvasId: 'drawcad',
      // cadFile: '/dwg/buf/hhhh.dwg',
      cadFile: 'http://219.151.151.45:10250/sxdzjm/data/dwg/buf/QXK01.dwg',
      useWebsocket: false,
      callback: (mxDrawObject: any, { canvas, canvasParent }: { canvas: any; canvasParent: any }) => {
        // Mx.MxFun.getCurrentDraw();
        mxDrawObject.setViewColor('rgba(0,0,0,0.1)');
      }
    });
  });
}
