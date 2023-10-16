/****************************************************************************
 名称：弹跳点
 描述：重写了弹跳点功能以修复demo功能


 最后修改日期：2022-04-09
 ****************************************************************************/


import { Cesium } from '../../Impl/Declare';
import { Cartesian3, Viewer } from 'cesium';

/**
 * 弹跳点样式参数
 * @property {string} [image]  弹跳点图标
 * @property {number} [bounceHeight]  弹跳点高度
 * @property {number} [increment]  弹跳点增量
 */
interface BouncePointStyle {
    image?: string,
    bounceHeight?: number,
    increment?: number
}

class bouncePoint {
    height: number;
    style;
    bounceMarker: any;
    lng: number;
    lat: number;
    position: Cartesian3;
    private viewer: Viewer;

    /**
     * 创建弹跳点
     * @param {Viewer} _viewer The base Cesium widget for building applications.
     * @param {Cartesian3} _position 弹跳点的位置
     * @param _style 弹跳点样式
     */
    constructor(_viewer: Viewer, _position: Cartesian3, _style?: BouncePointStyle) {
        this.viewer = _viewer;
        this.position = _position;
        let c = Cesium.Cartographic.fromCartesian(_position);
        this.lng = Cesium.Math.toDegrees(c.longitude);
        this.lat = Cesium.Math.toDegrees(c.latitude);
        this.height = c.height;
        this.style = {
            image: _style?.image || require('../../../../img/marker/mark3.png'),
            bounceHeight: _style?.bounceHeight || 100,
            increment: _style?.increment || 0.05
        };
        this.add();
    }

    /**
     * 添加弹跳点
     */
    add() {
        let h = this.height + this.style.bounceHeight;
        let t = 0;
        let cH = 0;
        this.bounceMarker = this.viewer.entities.add({
            position: new Cesium.CallbackProperty((e: any) => {
                cH += this.style.increment;
                t = t + cH;
                if (t > this.style.bounceHeight) {
                    t = this.style.bounceHeight;
                    cH *= -1;
                    cH *= 0.55;
                }
                return Cesium.Cartesian3.fromDegrees(this.lng, this.lat, h - t);
            }),
            billboard: {
                image: this.style.image,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });

        this.bounceMarker.bounce = (e: any) => {
            this.bounce();
        };
    }

    /**
     * 弹跳 删掉重新创建
     */
    bounce() {
        this.remove();
        this.add();
    }

    /**
     * 移除弹跳点
     */
    remove() {
        this.viewer.entities.remove(this.bounceMarker);
    }
}


export { bouncePoint };