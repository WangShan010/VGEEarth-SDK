/****************************************************************************
 名称：简单标注点装饰器
 描述：将一个常规的 entity ，改造为 带有标注点框体 的 entity

 最后修改日期：2022-05-25
 ****************************************************************************/


import { Cartesian3, Entity, Viewer } from 'cesium';
import { Cesium } from '../../../Impl/Declare';
import { getMainViewer } from '../../../Earth/lib/getMainViewer';
import { EventMana } from '../../../EventMana/EventMana';
import { CartographicTool } from '../../../../Utils/CoordinateTool/CartographicTool';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @classdesc 简单标签装饰器类，用于在Cesium场景中为实体添加标签窗口。
 */
class SimpleLabelDecorator {
    #viewer: Viewer;
    #entity: Entity;
    #cartesian3Position: Cartesian3 | undefined;
    #clampToGround: boolean = true;

    #windowDom: HTMLDivElement;
    #windowOpen: boolean = false;
    #containerDom: HTMLDivElement;
    #containerText: string = '';

    #eventInstance;

    /**
     * 创建一个SimpleLabelDecorator实例。
     * @param {Entity} entity - 要装饰的实体。
     * @param {string | HTMLDivElement} dom - 窗口内容的HTML字符串或HTMLDivElement。
     * @param {boolean} clampToGround - 是否将标签贴地显示。
     */
    constructor(entity: Entity, dom: string | HTMLDivElement, clampToGround: boolean = false) {
        this.#viewer = getMainViewer();
        this.#entity = entity;
        this.#windowDom = document.createElement('div');
        this.#windowDom.style.minWidth = '200px';
        this.#windowDom.style.minHeight = '100px';

        if (dom instanceof HTMLDivElement) {
            this.#containerDom = dom;
        } else {
            // @ts-ignore
            this.#containerText = dom;
            this.#containerDom = document.createElement('div');
        }

        const navigationDiv: HTMLDivElement | null = this.#containerDom;
        if (navigationDiv) {
            navigationDiv.style.display = 'none';
        }

        this.#clampToGround = clampToGround;
        this.#eventInstance = this.#clickEntity.bind(this);

        if (this.#entity.position) {
            this.#cartesian3Position = this.#entity.position.getValue(this.#viewer.clock.currentTime);

            // 如果贴地
            if (this.#cartesian3Position && this.#clampToGround) {
                let cartographic = CartographicTool.formCartesian3(this.#cartesian3Position);
                getTerrainMostDetailedHeight(cartographic.longitude, cartographic.latitude).then(height => {
                    this.#cartesian3Position = Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, height);
                });
            }
        }

        this.#addEvent();
    }

    /**
     * 关闭标签窗口。
     */
    closeWindow() {
        if (!this.#windowOpen) return;
        this.#viewer.scene.postRender.removeEventListener(this.#postRenderEvent.bind(this));
        this.#windowDom.innerHTML = '';
        this.#windowDom.remove();
        this.#windowOpen = false;
    }

    /**
     * 销毁装饰器实例。
     */
    destroy() {
        this.closeWindow();
        EventMana.screenEvent.removeEventListener(this.#eventInstance);
    }

    #addEvent() {
        let that = this;
        this.#viewer.scene.postRender.addEventListener(this.#postRenderEvent.bind(this));
        EventMana.screenEvent.addEventListener(
            EventMana.ListenType.ScreenSpaceEventType.LEFT_CLICK,
            EventMana.ScopeType.Viewer3D,
            that.#eventInstance
        );

        // 监听 Entity 是是否被销毁
        this.#entity.entityCollection.collectionChanged.addEventListener(function (e: any) {
            let entity = e._entities._array.find((entity: Entity) => entity.id === that.#entity.id);
            if (entity === undefined) {
                that.destroy();
            }
        });
    }

    #clickEntity(e: any) {
        let that = this;
        if (that.#windowOpen) return;
        let pick = that.#viewer.scene.pick(e.position);
        if (pick && pick.id === that.#entity) {
            that.#createDom();
        }
    }

    #createDom() {
        this.#windowOpen = true;

        // 大窗体本身
        this.#windowDom.classList.add('point-sample-label-container');

        // 关闭按钮
        let closeBtn = document.createElement('div');
        closeBtn.classList.add('point-sample-label-closeBtn');
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', this.closeWindow.bind(this), false);
        this.#windowDom.appendChild(closeBtn);

        // 窗体容器范围
        let label = document.createElement('div');
        label.classList.add('point-sample-label-text');
        if (this.#containerText) {
            label.innerText = this.#containerText;
        } else {
            label.appendChild(this.#containerDom);
        }


        this.#windowDom.appendChild(label);

        this.#viewer.cesiumWidget.container.appendChild(this.#windowDom);
    }

    #postRenderEvent() {
        const dom: HTMLDivElement | null = this.#containerDom;
        if (dom) {
            dom.style.display = 'block';
        }


        const canvasHeight = this.#viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        let position = this.#cartesian3Position;

        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.#viewer.scene,
            position,
            windowPosition
        );

        this.#windowDom.style.bottom = canvasHeight - windowPosition.y + 100 + 'px';
        this.#windowDom.style.left = windowPosition.x + 20 + 'px';
    }
}

export { SimpleLabelDecorator };