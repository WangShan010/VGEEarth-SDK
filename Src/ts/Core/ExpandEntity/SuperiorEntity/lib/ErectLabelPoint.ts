import { Cartesian3, Viewer } from 'cesium';
import { IDomPoint } from '../impl/point';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @class 竖立文本标注点,高度超过4000会消失
 */
class ErectLabelPoint implements IDomPoint {
    _position: Cartesian3;
    _viewer: Viewer;
    _label: HTMLElement;
    _$container: HTMLElement;
    _WorldDegree: WorldDegree;

    /**
     * @constructor
     * @param {Viewer} viewer 当前viewer
     * @param {WorldDegree} WorldDegree 位置
     * @param {HTMLElement} label 要展示的dom元素
     */
    constructor(viewer: Viewer, WorldDegree: WorldDegree, label: HTMLElement) {
        this._WorldDegree = WorldDegree;
        this._position = new Cesium.Cartesian3.fromDegrees();
        this._viewer = viewer;
        this._label = label;
        this._$container = document.createElement('div');
    }

    /**
     * 创建竖立文本标注
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
        this._addPostRender();
    }

    /**
     * 移除竖立文本标注
     */
    remove() {
        this._viewer.scene.postRender.removeEventListener(this._postRender, this);
        this._viewer.cesiumWidget.container.removeChild(this._$container);
    }

    /**
     * 获取当前点的位置
     * @returns {Cartesian3}
     */
    getPosition(): Cartesian3 {
        return this._position;
    }

    _addDom() {
        this._$container.classList.add('is-shulie');
        let label = document.createElement('div');
        label.appendChild(this._label);
        label.classList.add('is-shulie-item');
        this._$container.appendChild(label);

        let line = document.createElement('div');
        line.classList.add('pre-topCard-list-item-line');
        this._$container.appendChild(line);

        let circle = document.createElement('div');
        circle.classList.add('pre-topCard-list-item-circle');
        this._$container.appendChild(circle);
        this._viewer.cesiumWidget.container.appendChild(this._$container);
    }

    _addPostRender() {
        this._viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    _postRender() {
        if (!this._$container) return;
        if (!this._position) return;

        const canvasHeight = this._viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._position, windowPosition);

        this._$container.style.bottom = canvasHeight - windowPosition.y + 10 + 'px';
        const elWidth = this._$container.offsetWidth;
        this._$container.style.left = windowPosition.x - (elWidth / 2) + 'px';

        if (this._viewer.camera.positionCartographic.height > 4000) {
            this._$container.style.display = 'none';
        } else {
            this._$container.style.display = 'block';
        }
    }

}

export { ErectLabelPoint };