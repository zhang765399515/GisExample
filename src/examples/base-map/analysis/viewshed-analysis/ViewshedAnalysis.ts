import { BoundingSphere, Cartesian2, Cartesian3, Cartographic, CMath, Color, ComponentDatatype, Geometry, GeometryInstance, GeometryAttribute, Material, MaterialAppearance, Primitive, PrimitiveType, Ray, LabelStyle, Viewer, VerticalOrigin } from "geokey-gis";


type ConstructorOptions = {
    horizontalAngle?: number;
    verticalAngle?: number;
    distance?: number;
    visibleAreaColor?: Color;
    invisibleAreaColor?: Color;
    enabled?: boolean;
};

class ViewshedAnalysis {
    private viewer: Viewer;
    private _viewerPosition: Cartesian3;
    private _primitive: Primitive | null = null;
    private viewshedGeometry: any = null;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this._viewerPosition = new Cartesian3()
    }

    start(position: Cartesian3, options = {
        radius: 1000,           // 可视域半径
        horizontalAngle: 120,   // 水平角度
        verticalAngle: 90,      // 垂直角度
        resolution: 100         // 分析精度
    }) {
        this._viewerPosition = position;
        this.createViewshedGeometry(options);
    }

    private createViewshedGeometry(options: any) {
        // 清除之前的图形
        if (this._primitive) {
            this.viewer.scene.primitives.remove(this._primitive);
        }

        // 创建可视域几何体
        const positions = this.calculateViewshedPoints(options);
        debugger;
        // 创建几何体
        const geometry = new Geometry({
            attributes: {
                position: new GeometryAttribute({
                    componentDatatype: ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
                })
            },
            indices: this.createIndices(positions),
            primitiveType: PrimitiveType.TRIANGLES,
            boundingSphere: BoundingSphere.fromVertices(positions)
        });
        // 创建图元
        this._primitive = new Primitive({
            geometryInstances: new GeometryInstance({
                geometry: geometry
            }),
            appearance: new MaterialAppearance({
                material: new Material({
                    fabric: {
                        type: 'Color',
                        uniforms: {
                            color: new Color(0, 1, 0, 0.5)
                        }
                    }
                }),
                translucent: true
            })
        });

        this.viewer.scene.primitives.add(this._primitive);
    }

    private calculateViewshedPoints(options: any) {
        const { radius, horizontalAngle, verticalAngle, resolution } = options;
        const positions = [];

        // 计算观察点的地理坐标
        const viewerCartographic = Cartographic.fromCartesian(this._viewerPosition);
        const viewerLon = viewerCartographic.longitude;
        const viewerLat = viewerCartographic.latitude;
        const viewerHeight = viewerCartographic.height;

        // 计算可视域点
        for (let h = 0; h <= horizontalAngle; h += resolution) {
            for (let v = 0; v <= verticalAngle; v += resolution) {
                const horizontalRad = CMath.toRadians(h);
                const verticalRad = CMath.toRadians(v);

                // 计算射线方向
                const x = radius * Math.sin(horizontalRad) * Math.cos(verticalRad);
                const y = radius * Math.cos(horizontalRad) * Math.cos(verticalRad);
                const z = radius * Math.sin(verticalRad);

                // 转换为地理坐标
                const point = Cartesian3.fromElements(
                    viewerLon + x,
                    viewerLat + y,
                    viewerHeight + z
                );

                // 进行射线检测
                if (this.isPointVisible(this._viewerPosition, point)) {
                    positions.push(point.x, point.y, point.z);
                }
            }
        }

        return positions;
    }

    private isPointVisible(fromPosition: Cartesian3, toPosition: Cartesian3): boolean {
        const direction = Cartesian3.normalize(
            Cartesian3.subtract(toPosition, fromPosition, new Cartesian3()),
            new Cartesian3()
        );

        const ray = new Ray(fromPosition, direction);

        // 射线与地形的相交检测
        const result = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        if (!result) return true;

        // 计算距离
        const distance = Cartesian3.distance(fromPosition, toPosition);
        const intersectDistance = Cartesian3.distance(fromPosition, result);

        return intersectDistance >= distance;
    }

    private createIndices(positions: number[]): Uint16Array {
        // 创建三角形索引
        const indices = [];
        const vertexCount = positions.length / 3;

        for (let i = 0; i < vertexCount - 2; i++) {
            indices.push(0, i + 1, i + 2);
        }

        return new Uint16Array(indices);
    }

    // 高级功能：动态更新
    updatePosition(newPosition: Cartesian3) {
        this._viewerPosition = newPosition;
        this.createViewshedGeometry({
            radius: 1000,
            horizontalAngle: 120,
            verticalAngle: 90,
            resolution: 100
        });
    }

    // 添加观察点标记
    addViewerMarker() {
        return this.viewer.entities.add({
            position: this._viewerPosition,
            billboard: {
                image: './viewer-icon.png',
                verticalOrigin: VerticalOrigin.BOTTOM,
                scale: 0.5
            },
            label: {
                text: '观察点',
                font: '14px sans-serif',
                fillColor: Color.WHITE,
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(0, -10)
            }
        });
    }

    // 清除分析结果
    clear() {
        if (this._primitive) {
            this.viewer.scene.primitives.remove(this._primitive);
            this._primitive = null;
        }
    }
}

export default ViewshedAnalysis