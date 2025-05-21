import { CallbackProperty,Rectangle,ImageMaterialProperty,ClassificationType,CMath,Cartesian3 } from "geokey-gis"

let rotation = CMath.toRadians(30);
// function getRotationValue() {
//     if(west < 1){
//         west = -180
//     }
//     if(east < 1){
//         east = 180
//     }
//   west -= 1
//   east -= 1
//   return Rectangle.fromDegrees(west, -90, east, 90);
// //   return rotation;
// }
export function loadDynamicCloud(){
            let west = -180, east = -180
            window.viewer.entities.add({
                rectangle: {
                    coordinates: new CallbackProperty(()=>{
                        west == -1 ? west = -180 : west += 1
                        east == 0 ? east = -180 : east += 1
                        return Rectangle.fromDegrees(west, -90, east, 90)
                    }, false),
                    height: 20000,
                    material: new ImageMaterialProperty({
                        image: "image/earth_cloud.png",
                        transparent: true
                    })
                }
            })
}

