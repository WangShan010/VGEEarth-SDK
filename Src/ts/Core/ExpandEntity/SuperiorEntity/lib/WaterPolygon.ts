import { Cesium } from '../../../Impl/Declare';
import { Cartesian3, PrimitiveCollection, Viewer } from 'cesium';
import { Polygon } from 'GeoJSON';
import { Feature, FeatureCollection } from 'geojson';

/**
 * @classdesc 水体多边形类，用于在Cesium场景中创建水体效果的多边形。
 */
class WaterPolygon {
    geoJson;
    height: number = 11.7;
    red: number = 0;
    green: number = 0.2941177;
    blue: number = 0.2078431;
    alpha: number = 0.7;
    frequency: number = 20;
    animationSpeed: number = 0.005;
    amplitude: number = 1;
    boxPolygon;
    #viewer: Viewer;
    #collection: PrimitiveCollection;

    /**
     * 创建一个WaterPolygon实例。
     * @param {Viewer} viewer - Cesium Viewer实例。
     * @param {FeatureCollection} geoJson - 用于创建水体多边形的GeoJSON对象。
     * @param {number} height - 水体的高度，默认为11.7。
     */
    constructor(viewer: Viewer, geoJson: FeatureCollection, height: number = 11.7) {
        this.#viewer = viewer;
        this.#collection = new Cesium.PrimitiveCollection();
        geoJson = window.turf.flatten(geoJson);
        let union = geoJson.features.reduce((pre: Feature, cur: Feature) => {
            return window.turf.union(pre, cur);
        });
        this.geoJson = window.turf.flatten(union);
        this.boxPolygon = window.turf.bboxPolygon(window.turf.bbox(geoJson));
        this.height = height;
        this.reLoad();
    }

    /**
     * 重新加载水体多边形。
     */
    reLoad() {
        let that = this;
        that.#collection.removeAll();

        window.turf.geomEach(that.geoJson, (currentGeometry: Polygon) => {
            let coordinates = currentGeometry.coordinates[0];
            let positions = coordinates.map((c: number[]) => Cesium.Cartesian3.fromDegrees(c[0], c[1], c[2] || that.height));
            let primitive = new WaterPrimitive(positions, {
                baseWaterColor: new Cesium.Color(that.red, that.green, that.blue, that.alpha),
                normalMap: require('../../../../../img/水体特效/waterNormals.jpg'),
                frequency: that.frequency, // 波纹频率
                animationSpeed: that.animationSpeed, // 波动速度
                amplitude: that.amplitude // 波动速度
            });

            that.#collection.add(primitive);
        });

        that.#viewer.scene.primitives.add(that.#collection);
    }

    /**
     * 飞行到水体所在区域。
     * @returns {Promise<boolean>} 飞行操作是否成功。
     */
    async flyTo(): Promise<boolean> {
        if (this.boxPolygon) {
            return new Promise(resolve => {
                this.#viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(...this.boxPolygon.bbox),
                    complete: () => {
                        resolve(true);
                    }
                });
            });
        } else {
            return false;
        }
    }

    /**
     * 销毁水体多边形。
     */
    destroy() {
        return this.#viewer.scene.primitives.remove(this.#collection);
    }
}

class WaterPrimitive {
    private positions: Cartesian3[];
    private options: any;

    constructor(positions: Cartesian3[], options: any) {
        this.positions = positions;
        this.options = options;
        return this.createPrimitive();
    }

    /**
     * @classdesc 水体图元类，用于创建水体效果的图元。
     */
    createPrimitive() {
        //创建水体geometry
        let polygon1 = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(this.positions),
            perPositionHeight: true,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });

        return new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polygon1
            }),
            appearance: this.getApper(),
            show: true
        });
    }

    /**
     * 创建一个椭球体表面外观对象，表示地球表面的外观效果
     */
    getApper() {
        let apper = new Cesium.EllipsoidSurfaceAppearance({aboveGround: true});

        apper.material = new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    baseWaterColor: this.options.baseWaterColor,
                    normalMap: this.options.normalMap,
                    frequency: this.options.frequency,
                    animationSpeed: this.options.animationSpeed,
                    amplitude: this.options.amplitude
                }
            }
        });

        return apper;
    }
}


export { WaterPolygon };
