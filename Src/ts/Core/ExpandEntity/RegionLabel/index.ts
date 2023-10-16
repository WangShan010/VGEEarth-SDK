import { Cesium } from '../../Impl/Declare';
import { Viewer } from 'cesium';


class RegionLabel {
    #viewer: Viewer;
    #option: { backGround: string, wallgradients: string, size: number, colorLine: number[], colorPolygon: number[] };
    #features: any;
    #regionEntity: Array<any>; //区域实体
    constructor(viewer: Viewer, option: {
        backGround: string,
        wallgradients: string,
        size: number,
        colorLine: number[],
        colorPolygon: number[]
    }, regionJson: any) {
        this.#regionEntity = [];
        this.#viewer = viewer;
        this.#option = option;
        this.#features = regionJson;
        this.init();
        // this.remove();
    }

    init() {
        this.addPeripheryRegion();
        this.addPolyline();
        this.addRegion();
    }

    addPeripheryRegion() {
        let features = this.#features[0];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            // @ts-ignore
            let degreesArrayHeights = this.getDegreesArrayHeights(feature);
            let e = this.#viewer.entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                        this.getDegreesArrayHeights(feature, 500)
                    ),
                    width: 3,
                    material: Cesium.Color(this.#option.colorLine)
                },
                polygon: {
                    hierarchy:
                        Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    height: 0,
                    extrudedHeight: feature.properties.height,
                    material: new Cesium.ImageMaterialProperty({
                        image: this.#option.backGround,
                        repeat: new Cesium.Cartesian2(10, 10),
                        color: new Cesium.Color(this.#option.colorPolygon)
                    })
                }
            });
            this.#regionEntity.push(e);
        }
    }

    //湖北省线
    addPolyline() {
        let features = this.#features[1];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            let degreesArrayHeights = this.getDegreesArrayHeights(feature, 1e4);
            let e = this.#viewer.entities.add({
                polyline: {
                    positions:
                        Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    width: 3,
                    material: Cesium.Color.fromCssColorString('#ccc').withAlpha(0.4)
                }
            });
            this.#regionEntity.push(e);
            var n = Cesium.Cartographic.fromCartesian(
                    Cesium.BoundingSphere.fromPoints(
                        Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)
                    ).center
                ),
                l = Cesium.Math.toDegrees(n.longitude),
                a = Cesium.Math.toDegrees(n.latitude);
            e = this.#viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(l, a, 12e3),
                label: {
                    text: feature.properties.name,
                    fillColor: Cesium.Color.WHITE,
                    scale: this.#option.size,
                    font: 'normal 84px MicroSoft YaHei',
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                        0,
                        9000000
                    ),
                    scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.5),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    outlineWidth: 20,
                    outlineColor: Cesium.Color.BLACK
                }
            });
            this.#regionEntity.push(e);
        }
    }

    //湖北省面
    addRegion() {
        let features = this.#features[1];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            // @ts-ignore
            let degreesArrayHeights = this.getDegreesArrayHeights(feature);
            let e = this.#viewer.entities.add({
                polygon: {
                    hierarchy:
                        Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2e6),
                    height: 1e4,
                    //material: Cesium.Color.fromCssColorString("#2C577A").withAlpha(0.96)

                    material: new Cesium.ImageMaterialProperty({
                        image: this.#option.backGround,
                        repeat: new Cesium.Cartesian2(0, 1),
                        color: Cesium.Color.fromCssColorString('#2F5981').withAlpha(0.8)
                    })
                },
                wall: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                        this.getDegreesArrayHeights(feature, 1e4)
                    ),
                    material: new Cesium.ImageMaterialProperty({
                        image: this.#option.wallgradients,
                        repeat: new Cesium.Cartesian2(0, 1),
                        transparent: true,
                        color: Cesium.Color.fromCssColorString('#106C9D')
                    })
                }
            });
            this.#regionEntity.push(e);
        }
    }

    //获取坐标串
    getDegreesArrayHeights(feature: any, height: number) {
        let degreesArrayHeights = [];
        let coordinates;
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
            degreesArrayHeights.push(height || 0);
        }
        return degreesArrayHeights;
    }

    remove() {
        for (let i = 0; this.#regionEntity[i]; i++) {
            this.#viewer.entities.remove(this.#regionEntity[i]);
        }
    }
}

export { RegionLabel };
