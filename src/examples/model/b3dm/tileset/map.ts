import { Geokey3DTileset, GeokeyTerrainProvider,GeoElevationLayer, Color, ScreenSpaceEventHandler,defined,Cartographic,CMath,ScreenSpaceEventType } from "geokey-gis";

export function load3dtiles() {
    var layer1 = new GeoElevationLayer({
        url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=HLJ_demL13'
      })
      window.viewer.map.ground.layer.add(layer1);
    const tile = window.viewer.scene.primitives.add(new Geokey3DTileset({
        // url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yantian_dianyun2_new',
        url:'http://14.22.86.227:12022/service/gis/3DModel/wenhai/tileset.json?serviceName=wenhai_qxsy'
    }))
    tile.readyPromise.then(til => {
        window.viewer.zoomTo(tile)
        var handler = new ScreenSpaceEventHandler(window.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            // 获取点击位置的笛卡尔坐标
            var cartesian3 = window.viewer.scene.camera.pickEllipsoid(event.position, window.viewer.scene.globe.ellipsoid);
            if (cartesian3 && defined(cartesian3)) {
                // 将笛卡尔坐标转换为地理坐标
                var cartographic = Cartographic.fromCartesian(cartesian3);
                // 提取经度、纬度和高度
                var lng = CMath.toDegrees(cartographic.longitude);
                var lat = CMath.toDegrees(cartographic.latitude);
                var height = cartographic.height;

                // 输出结果
                console.log('Longitude: ' + lng + ', Latitude: ' + lat + ', Height: ' + height);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    })
    // window.viewer.scene.primitives.add(new Geokey3DTileset({
    //     url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yantian_dianyun2_33',
    // }))
    // window.viewer.scene.primitives.add(new Geokey3DTileset({
    //     url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yantian_dianyun161_170',
    // }))
    // window.viewer.scene.primitives.add(new Geokey3DTileset({
    //     url: 'http://14.22.86.227:12022/service/gis/3DModel/?serviceName=yantian_dianyun151_160',
    // }))
}