import { Cartesian3, Entity, Viewer } from 'cesium';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @class 动态文本标记，高度超过14000消失
 */
class DynamicDivLabel {
    position: Cartesian3;
    private viewer: Viewer;
    $container: HTMLElement;
    $body: any;
    $label: HTMLSpanElement | string;
    _WorldDegree: WorldDegree;
    p: Entity;

    /**
     * @constructor
     * @param {WorldDegree} WorldDegree 位置
     * @param {Viewer} viewer 当前viewer
     * @param {HTMLElement} label 要展示的div元素
     */
    constructor(viewer: Viewer, WorldDegree: WorldDegree, label: HTMLElement | string) {
        this.position = new Cesium.Cartesian3();
        this._WorldDegree = WorldDegree;
        this.viewer = viewer;
        this.$label = label;
        this.$container = document.createElement('div');
        this.viewer.cesiumWidget.container.appendChild(this.$container); //将字符串模板生成的内容添加到DOM上
        this.p = new Cesium.Entity();
    }

    async init() {
        this.$container.style.display = 'none';
        this._addDom();
        this._addPoint();
        let h = await getTerrainMostDetailedHeight(
            this._WorldDegree.longitude,
            this._WorldDegree.latitude
        );
        this.position = Cesium.Cartesian3.fromDegrees(
            this._WorldDegree.longitude,
            this._WorldDegree.latitude,
            h + (this._WorldDegree.height || 0)
        );
        // @ts-ignore
        this.p.position = this.position;
        this._addPostRender();
    }

    /**
     * 创建动态文本标记dom
     */
    _addDom() {
        //this.$container = document.createElement("div");
        this.$container.classList.add('dynamic-divlabel-container');
        this.$container.classList.add('dynamic-divlabel-container1');
        this.$body = document.createElement('div');
        this.$body.classList.add('sz-component-animate-marker__boder');

        console.log(this.$label);
        if (typeof this.$label === 'string') {
            let span = document.createElement('div');
            span.innerHTML = this.$label;
            this.$label = span;
        } else if (this.$label instanceof HTMLElement) {
            let span = document.createElement('div');
            span.appendChild(this.$label);
            this.$label = span;
        } else {
            console.error('传入的label参数不是HTMLElement或string类型');
        }

        this.$label.classList.add('sz-component-animate-marker__text');

        this.$body.appendChild(this.$label);
        this.$container.appendChild(this.$body);
    }

    /**
     * 添加点图元
     */
    _addPoint() {
        this.p = this.viewer.entities.add({
            position: this.position,
            point: new Cesium.PointGraphics({
                pixelSize: 10,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                color: Cesium.Color.RED
            })
        });
    }

    _addPostRender() {
        this.viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    _postRender() {
        if (!this.$container || !this.$container.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        // @ts-ignore
        const elHeight = this.$container.firstChild.offsetHeight;
        this.$container.style.bottom = canvasHeight - windowPosition.y + elHeight + 'px';
        // @ts-ignore
        const elWidth = this.$container.firstChild.offsetWidth;

        this.$container.style.left = windowPosition.x - (elWidth / 2) + 'px';

        if (this.viewer.camera.positionCartographic.height > 14000) {
            this.$container.style.display = 'none';
        } else {
            this.$container.style.display = 'block';
        }
    }

    remove() {
        this.$container.remove();
        this.viewer.scene.postRender.removeEventListener(this._postRender, this); //移除事件监听
        this.viewer.entities.remove(this.p);
    }
}

export { DynamicDivLabel };