/****************************************************************************
 名称：弹跳点
 描述：重写了弹跳点功能以修复demo功能


 最后修改日期：2022-04-09
 ****************************************************************************/
import { Cesium } from '../../Impl/Declare';
class bouncePoint {
    /**
     * 创建弹跳点
     * @param {Viewer} _viewer The base Cesium widget for building applications.
     * @param {Cartesian3} _position 弹跳点的位置
     * @param _style 弹跳点样式
     */
    constructor(_viewer, _position, _style) {
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
            position: new Cesium.CallbackProperty((e) => {
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
        this.bounceMarker.bounce = (e) => {
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
