import {
    SkyBox
} from 'geokey-gis';

export function setOneGroundSkyBox() {
    const skyBox = new SkyBox({
        sources: {
            positiveX: 'image/sky/sunny/right.jpg',
            negativeX: 'image/sky/sunny/left.jpg',
            positiveY: 'image/sky/sunny/front.jpg',
            negativeY: 'image/sky/sunny/back.jpg',
            positiveZ: 'image/sky/sunny/top.jpg',
            negativeZ: 'image/sky/sunny/bottom.jpg'
        }
    })
    window.viewer.scene.skyBox = skyBox;
    window.viewer.scene.skyAtmosphere.show = false;
}
export function setTwoGroundSkyBox(){
    const skyBox = new SkyBox({
        sources: {
            positiveX: 'image/sky/sunsetGlow/right.png',
            negativeX: 'image/sky/sunsetGlow/left.png',
            positiveY: 'image/sky/sunsetGlow/front.png',
            negativeY: 'image/sky/sunsetGlow/back.png',
            positiveZ: 'image/sky/sunsetGlow/top.png',
            negativeZ: 'image/sky/sunsetGlow/bottom.png'
        }
    })
    window.viewer.scene.skyBox = skyBox;
    window.viewer.scene.skyAtmosphere.show = false;
}
export function setThreeGroundSkyBox(){
    const skyBox = new SkyBox({
        sources: {
            positiveX: 'image/sky/blueSky/right.jpg',
            negativeX: 'image/sky/blueSky/left.jpg',
            positiveY: 'image/sky/blueSky/front.jpg',
            negativeY: 'image/sky/blueSky/back.jpg',
            positiveZ: 'image/sky/blueSky/top.jpg',
            negativeZ: 'image/sky/blueSky/bottom.jpg'
        }
    })
    window.viewer.scene.skyBox = skyBox;
    window.viewer.scene.skyAtmosphere.show = false;
}
