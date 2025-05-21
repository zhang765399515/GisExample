import { JulianDate,PostProcessStage,PostProcessStageCollection,PostProcessStageComposite,PostProcessStageLibrary } from 'geokey-gis'
let collection: PostProcessStageCollection | undefined= undefined;
let stage: PostProcessStage | PostProcessStageComposite | undefined= undefined;

export function addBlack() {
    collection = window.viewer.scene.postProcessStages;
    stage = PostProcessStageLibrary.createBrightnessStage();
    let utc = JulianDate.fromDate(new Date("2024/04/17 02:00:00"));//设置光照
    window.viewer.clockViewModel.currentTime = utc //北京时间
    collection.add(stage);
    window.viewer.shadowMap.darkness = 0.3
}
export function removeBlack(){
    collection&&collection._stages.forEach((e: { _name: string; })=> {
        if(e._name == "czm_brightness"){
            collection&&collection.remove(e);
        }
    });
}