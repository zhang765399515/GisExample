import { PostProcessStage, PostProcessStageCollection, PostProcessStageLibrary } from 'geokey-gis'
let collection: PostProcessStageCollection | undefined= undefined;
let stage: PostProcessStage | undefined = undefined;

export function addBlackWhite() {
    collection = window.viewer.scene.postProcessStages;
    stage = PostProcessStageLibrary.createBlackAndWhiteStage();
    let BlackWhiteVision = collection.add(stage);
    BlackWhiteVision.enabled = true;
    BlackWhiteVision.uniforms.gradations = 5.0;
}
export function removeBlackWhite(){
    if(collection&&stage){
        collection._stages.forEach((e: { _name: string; })=> {
            if(e._name == "czm_black_and_white"){
                collection.remove(e);
            }
        });
    }
}