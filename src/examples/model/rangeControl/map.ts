import {
    Geokey3DTileset,
    Rectangle,
    Cartesian3,
    CMath,
    BoundingSphere,
    Cartographic
} from "geokey-gis"
export function load3dtiles(){
    const tileset = window.viewer.scene.primitives.add(new Geokey3DTileset({
        url: 'http://14.22.86.227:12022/service/gis/3DModel/Scene/Production_2.json?serviceName=sz_hsl_b3dm20231109',
    }))
    tileset.readyPromise.then(tile =>{
        window.viewer.zoomTo(tileset)
    })
    return tileset;
}

export function rangeControl(tile){
        var boundingSphere = tile.boundingSphere;
        var center = boundingSphere.center;
        var radius = boundingSphere.radius;
    window.viewer.camera.moveEnd.addEventListener(function () {
        var cameraPosition = window.viewer.camera.position;
        var cameraPositionCartographic = Cartographic.fromCartesian(cameraPosition);
        var currentDistance = Cartesian3.distance( cameraPosition, center );
    
        // 如果相机距离超出边界，则调整距离
        if (currentDistance > radius) {
            var newPosition = Cartesian3.fromRadians(
                cameraPositionCartographic.longitude,
                cameraPositionCartographic.latitude,
                radius
            );
            window.viewer.camera.flyTo({
                destination:center
            })
        }
    });
}