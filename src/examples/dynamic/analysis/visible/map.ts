import {
    Cartesian3,
    ViewshedAnalysis
} from "geokey-gis";

export function widgetsViewshedAnalysis(dom: HTMLElement) {
    window.viewer.scene.requestRenderMode = false  // 开始实时刷新
    window.viewer.scene.globe.depthTestAgainstTerrain = true
    setTimeout(() => {
        new ViewshedAnalysis(dom, window.viewer)
    }, 2000);
    // window.viewer.extend() //加载可视域组件

    // var layer = new LodMeshLayer({
    //     url: 'http://218.201.45.168:19090/service/gis/3DModel/?serviceName=cq_ws_jinqiao',
    //     id: '1234'
    // })
    // window.viewer.map.add(layer);
    // return 
    // layer.readyPromise.then(function (lodMesh: any) {
    //     window.viewer.camera.flyTo({
    //         destination: Cartesian3.fromDegrees(lodMesh.origin.x, lodMesh.origin.y, lodMesh.origin.z + 1500),
    //         duration: 1
    //     });
    // })
}