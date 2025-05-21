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
    EllipsoidGeometry,
    CMath
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
                geometry: new EllipseGeometry({
                    center: position,
                    semiMajorAxis : 1000.0,
                    semiMinorAxis : 1000.0,
                }),
            })
        ],
        appearance: new MaterialAppearance({
            material: new Material({
                fabric: {
                    uniforms: {
                        color: Color.fromCssColorString('rgb(255,255,0)'),
                        speed: 10.0
                    },
                    source: 
                    `
                        uniform vec4 color;
                        uniform float speed;
                        czm_material czm_getMaterial(czm_materialInput materialInput){
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        vec2 st = materialInput.st ;
                        vec2 center = vec2(0.5);
                        float time = fract(czm_frameNumber * speed / 1000.0);
                        float r = 0.5 + sin(time) / 3.0;
                        float dis = distance(st, center);
                        float a = 0.0;
                        if(dis < r) {
                            a = 1.0 - smoothstep(0.0, r, dis);
                        }
                        material.alpha = pow(a,10.0) ;
                        material.diffuse = color.rgb * a * 3.0;
                        return material;
                    }
                    `
                },
            }),
        }),
        asynchronous: true
    }));
}


