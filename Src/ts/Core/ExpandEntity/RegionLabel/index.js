var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RegionLabel_viewer, _RegionLabel_option, _RegionLabel_features, _RegionLabel_regionEntity;
import { Cesium } from '../../Impl/Declare';
class RegionLabel {
    constructor(viewer, option, regionJson) {
        _RegionLabel_viewer.set(this, void 0);
        _RegionLabel_option.set(this, void 0);
        _RegionLabel_features.set(this, void 0);
        _RegionLabel_regionEntity.set(this, void 0); //区域实体
        __classPrivateFieldSet(this, _RegionLabel_regionEntity, [], "f");
        __classPrivateFieldSet(this, _RegionLabel_viewer, viewer, "f");
        __classPrivateFieldSet(this, _RegionLabel_option, option, "f");
        __classPrivateFieldSet(this, _RegionLabel_features, regionJson, "f");
        this.init();
        // this.remove();
    }
    init() {
        this.addPeripheryRegion();
        this.addPolyline();
        this.addRegion();
    }
    addPeripheryRegion() {
        let features = __classPrivateFieldGet(this, _RegionLabel_features, "f")[0];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            // @ts-ignore
            let degreesArrayHeights = this.getDegreesArrayHeights(feature);
            let e = __classPrivateFieldGet(this, _RegionLabel_viewer, "f").entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.getDegreesArrayHeights(feature, 500)),
                    width: 3,
                    material: Cesium.Color(__classPrivateFieldGet(this, _RegionLabel_option, "f").colorLine)
                },
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    height: 0,
                    extrudedHeight: feature.properties.height,
                    material: new Cesium.ImageMaterialProperty({
                        image: __classPrivateFieldGet(this, _RegionLabel_option, "f").backGround,
                        repeat: new Cesium.Cartesian2(10, 10),
                        color: new Cesium.Color(__classPrivateFieldGet(this, _RegionLabel_option, "f").colorPolygon)
                    })
                }
            });
            __classPrivateFieldGet(this, _RegionLabel_regionEntity, "f").push(e);
        }
    }
    //湖北省线
    addPolyline() {
        let features = __classPrivateFieldGet(this, _RegionLabel_features, "f")[1];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            let degreesArrayHeights = this.getDegreesArrayHeights(feature, 1e4);
            let e = __classPrivateFieldGet(this, _RegionLabel_viewer, "f").entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    width: 3,
                    material: Cesium.Color.fromCssColorString('#ccc').withAlpha(0.4)
                }
            });
            __classPrivateFieldGet(this, _RegionLabel_regionEntity, "f").push(e);
            var n = Cesium.Cartographic.fromCartesian(Cesium.BoundingSphere.fromPoints(Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)).center), l = Cesium.Math.toDegrees(n.longitude), a = Cesium.Math.toDegrees(n.latitude);
            e = __classPrivateFieldGet(this, _RegionLabel_viewer, "f").entities.add({
                position: Cesium.Cartesian3.fromDegrees(l, a, 12e3),
                label: {
                    text: feature.properties.name,
                    fillColor: Cesium.Color.WHITE,
                    scale: __classPrivateFieldGet(this, _RegionLabel_option, "f").size,
                    font: 'normal 84px MicroSoft YaHei',
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 9000000),
                    scaleByDistance: new Cesium.NearFarScalar(50000, 1, 500000, 0.5),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    outlineWidth: 20,
                    outlineColor: Cesium.Color.BLACK
                }
            });
            __classPrivateFieldGet(this, _RegionLabel_regionEntity, "f").push(e);
        }
    }
    //湖北省面
    addRegion() {
        let features = __classPrivateFieldGet(this, _RegionLabel_features, "f")[1];
        for (let i = 0; i < features.length; i++) {
            const feature = features[i];
            // @ts-ignore
            let degreesArrayHeights = this.getDegreesArrayHeights(feature);
            let e = __classPrivateFieldGet(this, _RegionLabel_viewer, "f").entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights),
                    //distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2e6),
                    height: 1e4,
                    //material: Cesium.Color.fromCssColorString("#2C577A").withAlpha(0.96)
                    material: new Cesium.ImageMaterialProperty({
                        image: __classPrivateFieldGet(this, _RegionLabel_option, "f").backGround,
                        repeat: new Cesium.Cartesian2(0, 1),
                        color: Cesium.Color.fromCssColorString('#2F5981').withAlpha(0.8)
                    })
                },
                wall: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.getDegreesArrayHeights(feature, 1e4)),
                    material: new Cesium.ImageMaterialProperty({
                        image: __classPrivateFieldGet(this, _RegionLabel_option, "f").wallgradients,
                        repeat: new Cesium.Cartesian2(0, 1),
                        transparent: true,
                        color: Cesium.Color.fromCssColorString('#106C9D')
                    })
                }
            });
            __classPrivateFieldGet(this, _RegionLabel_regionEntity, "f").push(e);
        }
    }
    //获取坐标串
    getDegreesArrayHeights(feature, height) {
        let degreesArrayHeights = [];
        let coordinates;
        if (feature.geometry.type == 'MultiPolygon') {
            coordinates = feature.geometry.coordinates[0][0];
        }
        else if (feature.geometry.type == 'Polygon') {
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
        for (let i = 0; __classPrivateFieldGet(this, _RegionLabel_regionEntity, "f")[i]; i++) {
            __classPrivateFieldGet(this, _RegionLabel_viewer, "f").entities.remove(__classPrivateFieldGet(this, _RegionLabel_regionEntity, "f")[i]);
        }
    }
}
_RegionLabel_viewer = new WeakMap(), _RegionLabel_option = new WeakMap(), _RegionLabel_features = new WeakMap(), _RegionLabel_regionEntity = new WeakMap();
export { RegionLabel };
