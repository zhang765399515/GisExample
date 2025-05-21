import * as geokeyGis from "geokey-gis"
import GeoTransform from "geotransform";
import hlj from "./heilongjiang.json"
import * as turf from '@turf/turf'
let isTexture = true;
export function loadSection() {
    window.viewer.camera.flyTo({
        // destination: new geokeyGis.Cartesian3.fromDegrees(124.82499298959912, 46.55099539947415,2000)
        destination: new geokeyGis.Cartesian3.fromDegrees(126.77569670520292, 46.09630625012271, 2000)
    })
    // hlj.forEach(e=>{
    //     drawOneLayer(e)
    // })
    let polygon = oneLayer();
    console.log('name：polygon',polygon);
    drawOneLayer(polygon)
}

export function loadBackground() {
    // window.viewer.scene.globe.baseColor = new geokeyGis.Color(53, 53, 53, 0.2);
    // window.viewer.scene.backgroundColor = new geokeyGis.Color(53, 53, 53, 0);
}
export function drawLine(data, color) {
    let line = window.viewer.entities.add({
        polyline: {
            positions: geokeyGis.Cartesian3.fromDegreesArrayHeights(data),
            material: geokeyGis.Color.fromCssColorString(color),
            width: 3,
            distanceDisplayCondition: new geokeyGis.DistanceDisplayCondition(1, 6000),
        }
    })
}
export function addPoint(position, color) {
    window.viewer.entities.add({
        position: position,
        point: {
            pixelSize: 10,
            color: geokeyGis.Color.fromCssColorString(color),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    })
}
export function oneLayer() {
    let pos = [
        126.77569670520292,
        46.09630625012271,
        57,
        126.77540676219897,
        46.0963082174859,
        57,
        126.77540676219897,
        46.0963082174859,
        67.2,
        126.77569670520292,
        46.09630625012271,
        67.2
    ]
    drawLine(pos, "#f00")
    return positionToUV(pos)
    // [ 124.82484324680198, 46.55083940921287 ],
    // [ 124.82499298959912, 46.55099539947415 ],
    // [ 124.82526473944235, 46.550871230647665 ],
    // [ 124.82511499619424, 46.55071524073485 ]
    
    // console.log('name：positionListuv',positionListuv);
    // addPoint(maxPoint, "#f00")
    // addPoint(minPoint, "#ff0")
    // addPoint(pointu, "#f0f")
    // addPoint(pointv, "#0f0")


}
export function positionToUV(pos){
    var line = turf.lineString([
        [126.77569670520292, 46.09630625012271],
        [126.77540676219897, 46.0963082174859],
    ]);
    var bbox = turf.bbox(line);
    let minPoint = geokeyGis.Cartesian3.fromDegrees(bbox[2], bbox[3], 57)
    let maxPoint = geokeyGis.Cartesian3.fromDegrees(bbox[0], bbox[1], 67.2)
    let pointu = geokeyGis.Cartesian3.fromDegrees(bbox[0], bbox[1], 57);
    let pointv = geokeyGis.Cartesian3.fromDegrees(bbox[2], bbox[3], 67.2);
    let repeatu = geokeyGis.Cartesian3.distance(pointu, minPoint);
    let repeatv = geokeyGis.Cartesian3.distance(pointv, minPoint);
    let positionListuv = [],indexs=[0,1,2,2,3,0];
    for (let i = 0; i < pos.length; i += 3) {
        let point = geokeyGis.Cartesian3.fromDegrees(pos[i], pos[i + 1], pos[i + 2]);
        let point0 = geokeyGis.Cartesian3.fromDegrees(pos[i], pos[i + 1], pos[2]);
        let a = geokeyGis.Cartesian3.distance(point0, minPoint);
        let b = geokeyGis.Cartesian3.distance(point0, point);
        let u;
        let v;
        if (repeatu >= repeatv) {
            u = a / repeatu > 1 ? 1 : a / repeatu;
            v = b / repeatu > 1 ? 1 : b / repeatu;
        }
        else {
            u = a / repeatv > 1 ? 1 : a / repeatv;
            v = b / repeatv > 1 ? 1 : b / repeatv;
        }
        // positionListuv.push(new geokeyGis.Cartesian2(u, v));
        positionListuv.push(u, v);
    }
    
    return {
        "vs":pos,
        "uvs":positionListuv,
        "fs":indexs
    }
}
export function drawOneLayer(data) {
        let geo_ins = createGeometryInstance(data.vs, data.uvs, data.fs);
        let repeat = new geokeyGis.Cartesian2(1, 1);
        let imgUrl = `image/section/泥岩.png`
        let lonlat = [126.77569670520292, 46.09630625012271]//任意取了剖面上的一个点
        
        let appear = createAppearence(repeat, imgUrl, lonlat);
        let layer = new geokeyGis.Primitive({
            geometryInstances: geo_ins,
            appearance: appear,
            asynchronous: false
        });
        layer.imgUrl = imgUrl
        layer.repeat = repeat;
        window.viewer.scene.primitives.add(layer)
    }
// export function drawOneLayer(data) {
//     let geo_ins = createGeometryInstance(data["vs"], data["uvs"], data["fs"]);
//     let repeat = new geokeyGis.Cartesian2(data.repeat[0] * -0.1, data["repeat"][1] * 0.1);
//     let name = data.name.split('_')[0]
//     let imgUrl = `image/section/${name}.png`
//     let lonlat = [124.82484324680198, 46.55083940921287]//任意取了剖面上的一个点
    
//     let appear = createAppearence(repeat, imgUrl, lonlat);
//     let layer = new geokeyGis.Primitive({
//         geometryInstances: geo_ins,
//         appearance: appear,
//         asynchronous: false
//     });
//     layer.imgUrl = imgUrl
//     layer.repeat = repeat;
//     window.viewer.scene.primitives.add(layer)
// }
export function createGeometryInstance(positions, uvs, indices) {
    let newArray = [];
    for (let i = 0; i < positions.length; i += 3) {
        // let lonlat = epsg2lonlat(positions[i], positions[i + 1]);
        // let newCartesian = new geokeyGis.Cartesian3.fromDegrees(lonlat[0], lonlat[1], positions[i + 2]);
        let newCartesian = new geokeyGis.Cartesian3.fromDegrees(positions[i], positions[i+1], positions[i + 2]);
        newArray.push(newCartesian.x, newCartesian.y, newCartesian.z);
    }
    console.log('name：newArray', newArray);
    let geometry = new geokeyGis.Geometry({
        attributes: {
            position: new geokeyGis.GeometryAttribute({
                componentDatatype: geokeyGis.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: newArray
            }),
            st: new geokeyGis.GeometryAttribute({
                componentDatatype: geokeyGis.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: uvs
            })
        },
        indices: indices, //索引指标，指示创建三角形的顺序
        primitiveType: geokeyGis.PrimitiveType.TRIANGLES,
        boundingSphere: geokeyGis.BoundingSphere.fromVertices(newArray)
    });
    return new geokeyGis.GeometryInstance({
        geometry: geometry
    });
}
export function epsg2lonlat(lon, lat) {
    let gt = new GeoTransform();
    let coords = [lon, lat];
    let transCoords = gt.transform("EPSG:4551", "EPSG:4326", coords);
    return transCoords;
}
export function createAppearence(repeat, imgUrl, lonlat) {
    let _Material;
    if (isTexture) {
        let center = geokeyGis.Cartesian3.fromDegrees(lonlat[0], lonlat[1], 50)
        const _Cartesian4Center = new geokeyGis.Cartesian4(center.x, center.y, center.z, 1);
        //获取depth深度，t0是指讲深度按距离（10-5000）让取值范围在（0,4）,取（0,4）是为了做4次梯度（实际应为1/4=0.25<0.3,z只做了3次），t控制在（0.3,1.0）是为了控制纹理的缩放比例不能太大。
        //t1是为了让纹理坐标偏移取平均值，ij从负号开始，即取的周围8个像素，具体看高斯模糊介绍，我不专业

        let fs = `czm_material czm_getMaterial(czm_materialInput materialInput)\
      {
                vec4 eyePosition = czm_view * pEC;\
                float depth=-eyePosition.z / eyePosition.w; \
                float startDistance = fogByDistance.x; \
                float startValue = fogByDistance.y; \
                float endDistance = fogByDistance.z; \
                float endValue = fogByDistance.w; \
                float t0 = floor(4.0*(depth - startDistance) / (endDistance - startDistance)); \
                float t= 1.3-clamp(t0/4.0, 0.3, 1.0); \
                float t1= clamp(t0+1.0, 1.0,2.0); \
                vec4 color = vec4(0.0);
                float seg = 5.0;
                float f = 0.0;
                float dv = 2.0/512.0;
                float tot = 0.0;
                for(float i = -5.0; i <= 5.0; ++i)
                {
                    for(float j = -5.0; j <= 5.0; ++j)
                    {
                        f = (1.1 - sqrt(i*i + j*j)/8.0);
                        f *= f;
                        tot += f;
                        color += texture2D( image, fract(vec2(repeat.x*t,repeat.y*t) * materialInput.st)+vec2(j*dv*t1,i*dv*t1)).rgba * f;
                    }
                }
                color /= tot;
                czm_material material = czm_getDefaultMaterial(materialInput);\
                material.diffuse=color.rgb;

                return material;
            }`;


        _Material =
        {
            type: "Image",
            uniforms: {
                image: imgUrl,
                repeat: repeat,
                // pEC: _Cartesian4Center,
                // fogByDistance: new geokeyGis.Cartesian4(10, 0.0, 5000, 1.0),
            },
            // source: fs
        }
    } else {
        _Material = {
            type: "Color",
            uniforms: {
                color: new geokeyGis.Color.fromCssColorString("rgba(255,255,255,1)")
            }
        }
    }
    return new geokeyGis.MaterialAppearance({
        material: new geokeyGis.Material({
            fabric: _Material
        }),
        flat: true, // 是否应用平面阴影
        show: true
    });
}