import type { Cartesian3, Viewer } from 'cesium';
import { Entity } from 'cesium';
import { IDomPoint } from '../impl/point';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @class 简单渐变标注点,高度超过4000会消失
 */
class GradientLabelPoint implements IDomPoint {
    _position: Cartesian3;
    private viewer: Viewer;
    _label: HTMLElement;
    _$container: HTMLElement;
    _WorldDegree: WorldDegree;
    p: Entity;

    /**
     * @constructor
     * @param {Viewer} viewer 当前viewer
     * @param {WorldDegree} WorldDegree 位置
     * @param {HTMLElement} label 要展示的dom元素
     */
    constructor(viewer: Viewer, WorldDegree: WorldDegree, label: HTMLElement) {
        this._WorldDegree = WorldDegree;
        this._position = new Cesium.Cartesian3.fromDegrees();
        this.viewer = viewer;
        this._label = label;
        this._$container = document.createElement('div');
        this.p = new Cesium.Entity();
    }

    /**
     * 创建简单渐变标注
     */
    async init() {
        this._addDom();
        let z = await getTerrainMostDetailedHeight(
            this._WorldDegree.longitude,
            this._WorldDegree.latitude
        );
        this._position = Cesium.Cartesian3.fromDegrees(
            this._WorldDegree.longitude,
            this._WorldDegree.latitude,
            z + (this._WorldDegree.height || 0)
        );
        this._addPoint();
        this._addPostRender();
    }

    /**
     * 移除简单渐变标注
     */
    remove() {
        this.viewer.scene.postRender.removeEventListener(this._postRender, this);
        this.viewer.cesiumWidget.container.removeChild(this._$container);
        this.viewer.entities.remove(this.p);
    }

    /**
     * 获取当前点的位置
     * @returns {Cartesian3}
     */
    getPosition(): Cartesian3 {
        return this._position;
    }


    _addPoint() {
        this.p = this.viewer.entities.add({
            position: this._position,
            point: new Cesium.PointGraphics({
                pixelSize: 10,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                color: Cesium.Color.RED
            })
        });
    }

    _addDom(): void {
        this._$container.classList.add('gradient-label');
        let label = document.createElement('div');
        label.appendChild(this._label);
        this._$container.appendChild(label);
        this.viewer.cesiumWidget.container.appendChild(this._$container);
    }

    _addPostRender(): void {
        this.viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    _postRender(): void {
        if (!this._$container) return;
        if (!this._position) return;

        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this._position, windowPosition);
        this._$container.style.position = 'absolute';
        this._$container.style.bottom = canvasHeight - windowPosition.y + 67 + 'px';
        const elWidth = this._$container.offsetWidth;
        this._$container.style.left = windowPosition.x - (elWidth / 2) - 2 + 'px';

        if (this.viewer.camera.positionCartographic.height > 4000) {
            this._$container.style.display = 'none';
        } else {
            this._$container.style.display = 'block';
        }
    }

}

export { GradientLabelPoint };