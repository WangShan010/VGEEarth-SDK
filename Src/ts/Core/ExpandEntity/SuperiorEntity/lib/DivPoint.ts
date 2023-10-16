import type { Cartesian3, Viewer } from 'cesium';
import { IDomPoint } from '../impl/point';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * div文本点,高度超过14000会消失
 */
class DivPoint implements IDomPoint {
    _position: Cartesian3;
    _viewer: Viewer;
    _label: HTMLElement;
    _$container: HTMLElement;
    _WorldDegree: WorldDegree;

    /**
     * @constructor
     * @param {WorldDegree} WorldDegree 位置
     * @param {Viewer} viewer 当前viewer
     * @param {HTMLElement} label 要展示的div元素
     */
    constructor(
        viewer: Viewer,
        WorldDegree: WorldDegree,
        label: HTMLElement
    ) {
        this._WorldDegree = WorldDegree;
        this._position = new Cesium.Cartesian3();
        this._viewer = viewer;
        this._label = label;
        this._$container = document.createElement('div');
    }

    /**
     * 创建div文本点
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
     * 移除div文本点
     */
    remove() {
        this._viewer.scene.postRender.removeEventListener(this._postRender, this); //移除事件监听
        this._$container.remove();
    }

    /**
     * 获取当前点的位置
     * @returns {Cartesian3}
     */
    getPosition(): Cartesian3 {
        return this._position;
    }

    _addDom() {
        this._$container.innerHTML = ` 
              <div class="div-point-container">
                  <div class="divpoint divpoint-theme">
                      <div class="divpoint-wrap">
                          <div class="divpoint-area">
                              <div class="arrow-lt"></div>
                              <div class="b-t"></div>
                              <div class="b-r"></div>
                              <div class="b-b"></div>
                              <div class="b-l"></div>
                              <div class="arrow-rb"></div>
                          </div>
                          <div class="b-t-l"></div>
                          <div class="b-b-r"></div>
                      </div>
                      <div class="arrow"></div>
                  </div>
              </div>
          `;
        let rb = this._$container.querySelector('.arrow-rb');
        rb!.after(this._label);
        this._viewer.cesiumWidget.container.appendChild(this._$container);
    }

    //添加场景事件
    _addPostRender() {
        this._viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    //场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
    _postRender() {
        if (!this._$container) return;
        const canvasHeight = this._viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this._viewer.scene,
            this._position,
            windowPosition
        );
        this._$container.style.position = 'absolute';
        this._$container.style.bottom = canvasHeight - windowPosition.y + 10 + 'px';
        this._$container.style.left = windowPosition.x + 'px';
        if (this._viewer.camera.positionCartographic.height > 14000) {
            this._$container.style.display = 'none';
        } else {
            this._$container.style.display = 'block';
        }
    }
}

export { DivPoint };