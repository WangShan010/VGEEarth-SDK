import type { Viewer } from 'cesium';
import type { FloatMarkerStyleType } from '../impl/point';
import { Cesium, WorldDegree } from '../../../Impl/Declare';

/**
 * @class 浮动点，高度超过2000会消失
 */
class FloatMarker {
    private viewer: Viewer;
    lng: number;
    lat: number;
    height: number;
    style: FloatMarkerStyleType;
    floatMarker: any;
    line: any;

    /**
     * @constructor
     * @param {WorldDegree} WorldDegree 位置
     * @param {Viewer} viewer 当前viewer
     * @param {FloatMarkerStyleType} style 要展示的浮动点样式
     */
    constructor(viewer: Viewer, WorldDegree: WorldDegree, style: FloatMarkerStyleType) {
        let a: FloatMarkerStyleType = {
            image: require('../../../../../img/marker/float.png'),//图标
            lineHeight: 16, //线高
            bounceHeight: 1, //高度
            increment: 0.008 //增量
        };
        this.viewer = viewer;
        this.lng = WorldDegree.longitude;
        this.lat = WorldDegree.latitude;
        this.height = WorldDegree.height || 0;
        this.style = style ? a : Object.assign(a, style);
        // this._add();

    }

    /**
     * 创建浮动点
     */
    init() {
        this._add();
    }

    /**
     * 添加浮动点
     */
    _add() {
        let mMinH = this.height + this.style.lineHeight; //marker的最小高度
        let mH = mMinH; //当前高度
        let i = true; //增减
        let mMaxH = mMinH + this.style.bounceHeight; //最大高度

        this.floatMarker = this.viewer.entities.add({
            position: new Cesium.CallbackProperty((e: object) => {
                if (i) {
                    mH += this.style.increment;
                    if (mH > mMaxH) i = false;
                } else {
                    mH -= this.style.increment;
                    if (mH < mMinH) i = true;
                }
                return Cesium.Cartesian3.fromDegrees(this.lng, this.lat, mH);
            }),
            billboard: {
                image: this.style.image,
                height: 78,
                width: 42,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000)
            }
        });
        this.line = this.viewer.entities.add({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    this.lng, this.lat, this.height,
                    this.lng, this.lat, mMinH
                ]),
                //  material: Cesium.Color.AQUA.withAlpha(0.8),
                material: new Cesium.PolylineDashMaterialProperty({color: Cesium.Color.AQUA}),
                width: 2,

                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000)
            }
        });
    }

    /**
     * 移除浮动点
     */
    remove() {
        this.viewer.entities.remove(this.floatMarker);
        this.viewer.entities.remove(this.line);
    }
}

export { FloatMarker };