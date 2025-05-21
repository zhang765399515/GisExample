import {
    Event,
    Material,
    Property,
    Color,
    Cartesian3,
    Transforms,
    Primitive,
    GeometryInstance,
    EllipseGeometry,
    MaterialAppearance,
    PerInstanceColorAppearance,
    EllipsoidGeometry
} from "geokey-gis"
export function loadEllipsoidElectricMaterialProperty(){
    window.viewer.camera.flyTo({
        destination:Cartesian3.fromDegrees(113.9236839, 22.528061,1000),
    })

    const position = Cartesian3.fromDegrees(113.9236839, 22.528061,100);
    const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);
    window.viewer.scene.primitives.add(new Primitive({
        geometryInstances:[
            new GeometryInstance({
                geometry: new EllipsoidGeometry({
                    radii : new Cartesian3(100.0, 100.0, 100.0),
                }),
                modelMatrix: modelMatrix,
            })
        ],
        appearance: new MaterialAppearance({
            material: new Material({
                fabric: {
                    uniforms: {
                        color: new Color(1.0, 0.0, 0.0, 1.0),
                        speed: 5.0
                    },
                    source: 
                    `
                        uniform vec4 color;
                        uniform float speed;
                        czm_material czm_getMaterial(czm_materialInput materialInput){
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            vec2 st = materialInput.st;
                            float time = fract(czm_frameNumber * speed / 1000.0);
                            float alpha = abs(smoothstep(0.5,1.,fract( -st.t - time)));
                            alpha += .1;
                            material.alpha = alpha;
                            material.diffuse = color.rgb;
                            return material;
                        }
                    `
                },
            }),
        }),
        asynchronous: true
    }));
}


