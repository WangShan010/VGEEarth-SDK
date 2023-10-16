import type { Color, Viewer } from 'cesium';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/index';

/**
 * @class 闪烁点，高度超过2000会消失
 */
class AlertMarker {
    private viewer: Viewer;
    position: WorldDegree;
    color: Color;
    iconUrl: string;
    pixelSize: number;
    pixelMax: number;
    outWidth: number;
    markerEntity: any;

    /**
     * @constructor
     * @param {Viewer} viewer 当前viewer
     * @param {WorldDegree} position 闪烁点所处空间位置
     * @param {any} style 要展示的闪烁点样式
     */
    constructor(viewer: Viewer, position: WorldDegree, style: any) {
        this.viewer = viewer;
        this.position = position;
        this.color = style.color || Cesium.Color.RED;
        this.iconUrl = style.iconUrl;
        this.pixelSize = style.pixelSize || 10;
        this.pixelMax = style.pixelMax || 50;
        this.outWidth = style.outWidth || 20;
    }

    /**
     * 初始化闪烁点
     */
    async init() {
        await this.createMarker();
    }

    /**
     * 创建闪烁点
     */
    private async createMarker() {
        let markerOpacity = 1,
            a = true,
            pixelSize = this.pixelSize,
            n = true,
            outLineOpacity = .7,
            o = true,
            pixelMax = this.pixelMax;

        let h = await getTerrainMostDetailedHeight(this.position.longitude, this.position.latitude);

        console.log(this.position, h, Cesium.Cartographic.fromDegrees(this.position.longitude, this.position.latitude, h));
        this.markerEntity = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, h)
        });

        this.markerEntity.point = {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            color: new Cesium.CallbackProperty(() => {
                return a ? (markerOpacity -= .03,
                markerOpacity <= 0 && (a = false)) : (markerOpacity = 1,
                    a = true),
                    this.color.withAlpha(markerOpacity);
            }, false),
            pixelSize: new Cesium.CallbackProperty(() => {
                return n ? (pixelSize += 2,
                pixelSize >= pixelMax && (n = false)) : (pixelSize = 10,
                    n = true),
                    pixelSize;
            }, false),
            outlineColor: new Cesium.CallbackProperty(() => {
                return o ? (outLineOpacity -= .035,
                outLineOpacity <= 0 && (o = false)) : (outLineOpacity = .7,
                    o = true),
                    this.color.withAlpha(outLineOpacity);
            }, false),
            outlineWidth: this.outWidth,
            scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4)
        };

        if (this.iconUrl) {
            this.markerEntity.billboard = {
                image: this.iconUrl,
                scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            };
        }
    }

    /**
     * 移除浮动点
     */
    remove() {
        this.viewer.entities.remove(this.markerEntity);
        this.markerEntity = undefined;
    }
}

export { AlertMarker };