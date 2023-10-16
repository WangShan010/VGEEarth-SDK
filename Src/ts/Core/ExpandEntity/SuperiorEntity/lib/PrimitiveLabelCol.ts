import { Viewer } from 'cesium';
import { Cesium } from '../../../Impl/Declare';

/**
 * @class 图标+文字（primitive方式）
 */
class PrimitiveLabelCol {
    private viewer: Viewer;
    billboards;
    labels;

    /**
     * @constructor
     * @param {Viewer} viewer 当前viewer
     */
    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.billboards = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
        this.labels = this.viewer.scene.primitives.add(new Cesium.LabelCollection());
    }

    _add(position: string, label: string, imgUrl: string) {
        this.addBillboard(position, imgUrl);
        this.addLabel(position, label);
    }

    /**
     * 添加单个图标点
     */
    addBillboard(position: string, imgUrl: string) {
        this.billboards.add({
            position: position,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            image: imgUrl,
            scale: 0.6,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0.4)
        });
    }

    /**
     * 添加单个文本
     */
    addLabel(position: string, label: string) {
        this.labels.add({
            position: position,
            text: label,
            fillColor: Cesium.Color.WHITE,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scale: 0.4,
            font: 'normal 40px MicroSoft YaHei',
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
            scaleByDistance: new Cesium.NearFarScalar(50000, 1, 1000000, 0.4),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(14, -4),
            outlineWidth: 20,
            outlineColor: Cesium.Color.BLACK
        });
    }

    /**
     * 移除
     */
    remove() {
        this.viewer.scene.primitives.remove(this.billboards);
        this.viewer.scene.primitives.remove(this.labels);
    }
}

export { PrimitiveLabelCol };