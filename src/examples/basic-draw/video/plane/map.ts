import { 
    Cartesian3, 
    CustomDataSource, 
    PolylineGlowMaterialProperty,
    Color, 
    Entity, 
    Plane,
    Cartesian2,
    ImageMaterialProperty
} from 'geokey-gis';
export function loadVideo(options) {
    if (options && options.position) {
        window.viewer.camera.flyTo({
            destination:options.position
        })
      var entity = new Entity();
      entity.position = options.position
      entity.plane = {
        plane: new Plane(options.normal || Cartesian3.UNIT_Y, 0.0),
        dimensions: options.dimensions || new Cartesian2(200.0, 150.0),
        material: new ImageMaterialProperty({
          image: options.videoElement
        })
      }
      return window.viewer.entities.add(entity);
    }
  }