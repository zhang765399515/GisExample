
import { Cartesian3, PolygonHierarchy, CustomDataSource, PolylineGlowMaterialProperty, Color } from 'geokey-gis';
import gz_point from "./lonlatQiang.json"
export function addMasker() {
    window.viewer.scene.requestRenderMode = false;// 开启实时刷新
    const dataSource = new CustomDataSource("inverseShade"); // 创建自定义的DataSource
    const hole = Cartesian3.fromDegreesArray(gz_point);

    window.viewer.dataSources.add(dataSource);

    setTimeout(() => {
        dataSource.entities.add({
            polygon: {
                hierarchy: {
                    //左下左上右上右下
                    // 对应经纬度[-0,60],[-0,-60],[-180,-60],[-180,60],[-0,60]
                    positions: [
                        new Cartesian3(
                            3197104.586923899,
                            -0.5580000157243585,
                            5500477.1339386385,
                        ),
                        new Cartesian3(
                            3197104.586923899,
                            -0.5580000157243585,
                            -5500477.1339386385,
                        ),
                        new Cartesian3(
                            -3197104.5869239476,
                            -3.915323898915733,
                            -5500477.1339386385,
                        ),
                        new Cartesian3(
                            -3197104.5869239476,
                            -3.915323898915733,
                            5500477.1339386385,
                        ),
                        new Cartesian3(
                            3197104.586923899,
                            -0.5580000157243585,
                            5500477.1339386385,
                        ),
                    ],
                    holes: [new PolygonHierarchy()]
                },
                // 填充的颜色，withAlpha透明度
                material: Color.BLACK.withAlpha(0.9),
                // 是否被提供的材质填充
                fill: true,
                // 是否显示
                show: true,
                // 顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
                zIndex: 10,
            },
        });
        dataSource.entities.add({
            polygon: {
                // 获取指定属性（positions，holes（图形内需要挖空的区域））
                hierarchy: {
                    //左下左上右上右下
                    // 对应经纬度[0,60],[0,-60],[180,-60],[180,60],[0,60]
                    positions: [
                        new Cartesian3(
                            3197104.586923899,
                            0.5580000157243585,
                            5500477.1339386385,
                        ),
                        new Cartesian3(
                            3197104.586923899,
                            0.5580000157243585,
                            -5500477.1339386385,
                        ),
                        new Cartesian3(
                            -3197104.5869239476,
                            3.915323898915733,
                            -5500477.1339386385,
                        ),
                        new Cartesian3(
                            -3197104.5869239476,
                            3.915323898915733,
                            5500477.1339386385,
                        ),
                        new Cartesian3(
                            3197104.586923899,
                            0.5580000157243585,
                            5500477.1339386385,
                        ),
                    ],
                    holes: [new PolygonHierarchy(hole)],
                },
                // 填充的颜色，withAlpha透明度
                material: Color.BLACK.withAlpha(0.9),
                // 是否被提供的材质填充
                fill: true,
                // 是否显示
                show: true,
                // 顺序,仅当`clampToGround`为true并且支持地形上的折线时才有效。
                zIndex: 10,
            },
        });
        dataSource.entities.add({
            polyline: {
                positions: hole,
                width: 10,
                material: new PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Color.AQUA
                }),
                clampToGround: true,
            },
        });

    }, 1000)
}