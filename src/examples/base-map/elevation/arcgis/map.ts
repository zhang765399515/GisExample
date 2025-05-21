import { ArcGISTiledElevationTerrainProvider } from "geokey-gis";

/**
 * 加载Arcgis服务高程
 */
export function loadArcGISLayer() {
  let elevationLayer = new ArcGISTiledElevationTerrainProvider({
    url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
  });

  window.viewer.terrainProvider = elevationLayer;

  let flyToOpts = {
    destination: {
      x: -1135832.2500233247,
      y: 5482646.852955472,
      z: 3124157.6677550175
    },
    orientation: {
      heading: 0.9231787775159015,
      pitch: -0.409062086563442,
      roll: 0.002490493263910487
    },
    duration: 1
  };
  window.viewer.scene.camera.flyTo(flyToOpts as any);
}
