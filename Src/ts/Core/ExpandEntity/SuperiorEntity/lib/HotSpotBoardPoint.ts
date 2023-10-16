import type { Cartesian3, Viewer } from 'cesium';
import { IDomPoint } from '../impl/point';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @class 热点面板文本点,高度超过5000会消失
 */
class HotSpotBoardPoint implements IDomPoint {
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
     * 创建热点面板文本
     */
    async init() {
        this._$container.style.display = 'none';
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
    remove(): void {
        this._$container.remove();
        this._viewer.scene.postRender.removeEventListener(this._postRender, this);
    }

    /**
     * 获取当前点的位置
     * @returns {Cartesian3}
     */
    getPosition(): Cartesian3 {
        return this._position;
    }

    _addDom(): void {
        this._$container.innerHTML =
            `<div class="hot-spot">
            <div class="hot-spot-board hot-spot-board-medium"></div>
            <div class="hot-spot-line hot-spot-line-medium"></div>
        </div>`;
        let div = this._$container.querySelector('.hot-spot') as HTMLElement;
        let board = this._$container.querySelector('.hot-spot-board') as HTMLElement;
        board!.appendChild(this._label);
        this._viewer.cesiumWidget.container.appendChild(this._$container);

        div.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_18.png')})`;
        board.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_19.png')})`;
        this._$container.onmouseover = e => {
            div.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_21.png')})`;
            board.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_20.png')})`;
        };

        this._$container.onmouseout = e => {
            div.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_18.png')})`;
            board.style.backgroundImage = `url(${require('../../../../../img/hotspotboard/home_icon_19.png')})`;

        };
    }

    _addPostRender(): void {
        this._viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    _postRender(): void {
        if (!this._$container) return;
        const canvasHeight = this._viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._viewer.scene, this._position, windowPosition);
        this._$container.style.position = 'absolute';
        this._$container.style.bottom = canvasHeight - windowPosition.y + 10 + 'px';
        const elWidth = this._$container.offsetWidth;
        this._$container.style.left = windowPosition.x - (elWidth / 2) + 'px';

        if (this._viewer.camera.positionCartographic.height > 5000) {
            this._$container.style.display = 'none';
        } else {
            this._$container.style.display = 'block';
        }
    }

}

export { HotSpotBoardPoint };