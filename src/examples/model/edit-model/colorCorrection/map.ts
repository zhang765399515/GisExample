import {
    Geokey3DTileset,
    Geokey3DTileStyle,
    Geokey3DTileFeature,
    ScreenSpaceEventType,
    CustomShader,
    Color,
    PostProcessStage,
    Cartesian3,
    PostProcessStageLibrary,
    defined,
} from "geokey-gis";

export function load3dtiles() {
    const tile = window.viewer.scene.primitives.add(new Geokey3DTileset({
        // url: 'http://14.22.86.227:12022/service/gis/3DMode/l/Scene/Production_2.json?serviceName=sz_hsl_b3dm20231109',
        url: "http://127.0.0.1:8081/tileset.json"
    }))
    
    tile.readyPromise.then(til => {
        window.viewer.zoomTo(tile)
        let ent = window.viewer.entities.add({
            position:tile.boundingSphere.center,
            model:{
                uri:'model/scene/scene.gltf',
                scale:0.1
            }
        })

        let ent2 = window.viewer.entities.add({
            position:tile.boundingSphere.center,
            point:{
                pixelSize:30
            }
        })


        
    var collection = window.viewer.scene.postProcessStages;
    var silhouette = collection.add(PostProcessStageLibrary.createSilhouetteStage());
    silhouette.enabled = true;
    silhouette.uniforms.color = Color.YELLOW;
    //_________________
    const fs = `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    uniform vec4 highlight;
    void main() {
        vec4 color = texture2D(colorTexture, v_textureCoordinates);
        if (czm_selected()) {
            vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;
            gl_FragColor = vec4(highlighted, 1.0);
        } else {
            gl_FragColor = color;
        }
    }`;
    const stage = window.viewer.scene.postProcessStages.add(new PostProcessStage({
        fragmentShader: fs,
        uniforms: {
            highlight: function () {
                return Color.fromCssColorString('#ff0000');
            }
        }
    }));
    stage.selected = [];
    const handler = window.viewer.screenSpaceEventHandler;
    handler.setInputAction((event: any) => {
        let feature = window.viewer.scene.pick(event.position);
        console.log('name：feature',feature);
        if (defined(feature)) {
            if(feature.id){
                stage.selected = [feature.primitive];
            }else{
                stage.selected = [feature];
            }
          } else {
            stage.selected = [];
          }
        
        
    }, ScreenSpaceEventType.LEFT_CLICK);
    })
}