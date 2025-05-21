import {Cartographic, CMath,Cartesian3} from 'geokey-gis';
export function getCurrentCamera(){
    const camera = window.viewer.camera;
    const position = camera.position;
    const cartographic = Cartographic.fromCartesian(position);
    const longitude = CMath.toDegrees(cartographic.longitude);
    const latitude = CMath.toDegrees(cartographic.latitude);
    const altitude = cartographic.height;

    const heading = camera.heading;
    const pitch = camera.pitch;
    const roll = camera.roll;
    return {
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
        heading: heading,
        pitch: pitch,
        roll: roll,
    }
}
export function flyTo(location: any) {
    console.log(location,1111)
    window.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees( location.longitude, location.latitude, location.altitude),
        duration: 1,
        orientation:{
            heading:location.heading,
            pitch:location.pitch,
            roll:location.roll
        }
    })
}