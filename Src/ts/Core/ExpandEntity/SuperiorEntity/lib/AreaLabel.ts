import { Cesium } from '../../../Impl/Declare';
import { Cartesian3, Color, Entity, GeometryInstance, PolygonGeometry, Primitive, Viewer } from 'cesium';


import { PrimitiveGradientAppearance } from './PrimitiveGradientAppearance';

interface areaLabelOption {
    position: Cartesian3,
    label: string
}

/**
 * 区域标注
 */
class AreaLabel {
    private viewer: Viewer;
    color: Color[];
    label: areaLabelOption[];
    features;
    entitys: Entity[];
    primitives: Primitive[];

    /**
     * @constructor
     * @param { Viewer } viewer 当前视图
     * @param { Color[] } color 颜色数组，和区域顺序一一对应
     * @param { {position:Cartesian3, label:string}[] }label 注记配置对象数组，包含位置，注记文本信息，和区域顺序一一对应
     * @param { geoJson.features } features geojson文件中的features对象，表示区域的位置信息，可满足MultiPolygon和Polygon两种类型
     */
    constructor(
        viewer: Viewer,
        color: Color[],
        label: areaLabelOption[],
        features: any
    ) {
        this.viewer = viewer;
        this.color = color;
        this.label = label;
        this.features = features;
        this.entitys = [];
        this.primitives = [];
    }

    init() {
        let that = this;
        that.features.forEach((item: number, index: number) => {
            that._addRegion(item, index);
        });
    }

    _addRegion(feature: number, index: number) {
        let that = this;
        let degreesArrayHeights = that._getDegreesArrayHeights(feature);
        let positions: Array<Cartesian3> = Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights);
        let polygon: PolygonGeometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            vertexFormat: Cesium.VertexFormat.ALL
        });
        // @ts-ignore
        let geometry: PolygonGeometry = Cesium.PolygonGeometry.createGeometry(polygon);
        let instance: GeometryInstance = new Cesium.GeometryInstance({
            geometry: geometry
        });
        that.primitives.push(that.viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: instance,
            // @ts-ignore
            appearance: new PrimitiveGradientAppearance(that.color[index])
        })));
        // 添加边线
        that.entitys.push(that.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: that.color[index].withAlpha(1)
                })
            }
        }));
        // 添加标注
        that.entitys.push(that.viewer.entities.add({
            position: that.label[index].position,
            label: {
                text: that.label[index].label,
                fillColor: that.color[index],
                scale: 0.5,
                font: 'normal 45px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 9000000),
                scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.5),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                outlineWidth: 10,
                outlineColor: Cesium.Color.BLACK
            }
        }));

    }

    _getDegreesArrayHeights(feature: any) {
        let degreesArrayHeights: number[] = [];
        let coordinates: number[][] = [];
        if (feature.geometry.type == 'MultiPolygon') {
            coordinates = feature.geometry.coordinates[0][0];
        } else if (feature.geometry.type == 'Polygon') {
            coordinates = feature.geometry.coordinates[0];
        }
        //坐标串转为需要的格式[x,y,z,x,y,z....]
        for (let i = 0; i < coordinates.length; i++) {
            const element = coordinates[i];
            degreesArrayHeights.push(element[0]);
            degreesArrayHeights.push(element[1]);
            degreesArrayHeights.push(element[2] || 100);
        }
        return degreesArrayHeights;

    }

    destroy() {
        let that = this;
        that.entitys.forEach(entity => {
            that.viewer.entities.remove(entity);
        });
        that.entitys = [];
        that.primitives.forEach(primitive => {
            that.viewer.scene.primitives.remove(primitive);
        });
        that.primitives = [];
    }
}

export { AreaLabel };
