import { SceneView, Viewer } from "geokey-gis";

declare global {
  interface Window {
    PGEarth: any,

    initMap: any,
    viewer: SceneView,
    windGlobe: any,
    _earthInstance: any
  }
}