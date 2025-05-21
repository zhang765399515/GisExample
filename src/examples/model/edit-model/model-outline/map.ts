import {
    Geokey3DTileset,
    PostProcessStageLibrary,
    Color,
    defined,
    ScreenSpaceEventType
} from "geokey-gis"
export function load3dtiles(){
    const tileset = window.viewer.scene.primitives.add(new Geokey3DTileset({
        url: 'http://14.22.86.227:12022/service/gis/3DModel/shenzhen_jianzhu/tileset.json?serviceName=sz_baimo',
    }))
    tileset.readyPromise.then(tile =>{
        window.viewer.zoomTo(tileset)
    })
}
export function modelOutLine(){
    load3dtiles()
    const selected = {
        feature: undefined,
        originalColor: new Color(),
    };
    if(PostProcessStageLibrary.isSilhouetteSupported(window.viewer.scene)){
        const silhouetteBlue = PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Color.YELLOW;
        silhouetteBlue.uniforms.length = 0.01;
        silhouetteBlue.selected = [];

        const silhouetteGreen = PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteGreen.uniforms.color = Color.RED;
        silhouetteGreen.uniforms.length = 0.01;
        silhouetteGreen.selected = [];

        window.viewer.scene.postProcessStages.add(
            PostProcessStageLibrary.createSilhouetteStage([
                silhouetteBlue,
                silhouetteGreen,
            ])
        );
        window.viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            silhouetteBlue.selected = [];
            const pickedFeature = window.viewer.scene.pick(movement.endPosition);
            if (pickedFeature !== selected.feature) {
                silhouetteBlue.selected = [pickedFeature];
            }
        },ScreenSpaceEventType.MOUSE_MOVE);
        window.viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
            silhouetteGreen.selected = [];
            const pickedFeature = window.viewer.scene.pick(movement.position);
            console.log('name：pickedFeature',pickedFeature);
            if (!defined(pickedFeature)) {
                return;
            }
            if (silhouetteGreen.selected[0] === pickedFeature) {
                return;
            }
            const highlightedFeature = silhouetteBlue.selected[0];
            if (pickedFeature === highlightedFeature) {
                silhouetteBlue.selected = [];
            }
            silhouetteGreen.selected = [pickedFeature];
        }, ScreenSpaceEventType.LEFT_CLICK);
    }
}