import { PostProcessStage, PostProcessStageCollection, PostProcessStageLibrary } from 'geokey-gis'
let collection: PostProcessStageCollection | undefined= undefined;
let stage: PostProcessStage | undefined = undefined;

export function addNight() {
    collection = window.viewer.scene.postProcessStages;
    stage = PostProcessStageLibrary.createNightVisionStage();
    let nightVision = collection.add(stage);
    nightVision.enabled = true;
}
export function removeNight(){
    if(collection&&stage){
        collection._stages.forEach((e: { _name: string; })=> {
            if(e._name == "czm_night_vision"){
                collection.remove(e);
            }
        });
    }
}