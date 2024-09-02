import { Cesium } from '../../../../Impl/Declare';
class FlyCylinder {
    /**
     *
     * @param {Viewer} _viewer The base Cesium widget for building applications
     * @param {SampledPositionProperty} _property 取样位置
     * @param {FlyCylinderStyle} [_style] 投影圆柱体的样式参数
     */
    constructor(_viewer, _property, _style) {
        this.cylinder = null;
        this.viewer = _viewer;
        this.property = _property;
        this.style = _style || {};
        this.addCylinder();
    }
    /**
     * 将该投影圆柱体添加到实体集合中
     */
    addCylinder() {
        let lastPosition;
        this.cylinder = this.viewer.entities.add({
            position: new Cesium.CallbackProperty((e) => {
                const position = this.getPosition();
                if (position) {
                    lastPosition = position;
                    return position;
                }
                else if (lastPosition) {
                    return lastPosition;
                }
                else {
                    return new Cesium.Cartesian3(0, 0, 0);
                }
            }, false),
            cylinder: {
                length: this.style.length || 200,
                topRadius: this.style.topRadius || 0,
                bottomRadius: this.style.bottomRadius || 240,
                material: this.style.material || Cesium.Color.RED.withAlpha(0.3)
            }
        });
    }
    getPosition() {
        const position = this.property.getValue(this.viewer.clock.currentTime);
        if (position) {
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height - (this.style.length || 200 / 2));
        }
        else {
            return null;
        }
    }
    remove() {
        this.cylinder && this.viewer.entities.remove(this.cylinder);
    }
}
export { FlyCylinder };
