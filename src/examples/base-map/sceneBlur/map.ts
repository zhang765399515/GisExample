import { 
    PostProcessStageLibrary,
    Model,
    Matrix4,
    Cartesian3,
    Quaternion,
    HeadingPitchRoll,
    Transforms
} from "geokey-gis"
export function loadGltf(){
    let tiles = window.viewer.scene.primitives.add(Model.fromGltf({
        url: "glb/mx_yhd_nsl1/fbxToGlth.gltf",
        modelMatrix: Transforms.eastNorthUpToFixedFrame( Cartesian3.fromDegrees(114.491946899531, 22.6533736967405, 10)),
        minimumPixelSize: 100
    }));
    tiles.readyPromise.then(tile =>{
        window.viewer.camera.flyTo({
            destination:Cartesian3.fromDegrees(114.491946899531, 22.6533736967405, 1000)
        })
    })
}
export function loadData(){
   return window.viewer.scene.postProcessStages.add(PostProcessStageLibrary.createDepthOfFieldStage());
}