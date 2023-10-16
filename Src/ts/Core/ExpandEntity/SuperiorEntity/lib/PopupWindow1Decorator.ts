import { Entity } from 'cesium';
import { Cesium } from '../../../Impl/Declare';
import { BaseDecorator } from '../impl/BaseDecorator';
import { SafeTool } from '../../../../Utils/index';


/**
 * 表示一个弹窗装饰器类，用于在地图上显示自定义弹窗。
 */
class PopupWindow1Decorator extends BaseDecorator {

    id: string;
    title: string;
    html: HTMLElement;
    container: HTMLDivElement;

    /**
     * 创建一个 PopupWindow1Decorator 实例。
     * @param entity 实体对象。
     * @param params 参数。
     * @param clampToGround 是否贴地显示。
     */
    constructor(entity: Entity, params: any = {}, clampToGround: boolean = false) {
        super(entity, params, clampToGround);

        this.id = SafeTool.uuid();
        this.title = params.title || '弹窗';
        this.html = params.html || '测试div';
        this.container = document.createElement('div');
    }

    /**
     * 弹窗渲染后的事件处理。
     */
    postRenderEvent() {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        let position = this.cartesian3Position;

        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            position,
            windowPosition
        );

        this.container.style.position = 'absolute';
        this.container.style.bottom = canvasHeight - windowPosition.y + 90 + 'px';
        this.container.style.left = windowPosition.x - 350 / 2 + 'px';
    }

    /**
     * 创建弹窗装饰。
     */
    createDecorator() {
        if (this.decoratorOpen) return;
        this.decoratorOpen = true;
        this.viewer.cesiumWidget.container.appendChild(this.container);

        let id = this.id;
        this.container.innerHTML = `
        <div class="popup3d1-container">
          <div class="popup3d1-header">
            <span class="popup3d1-header-title">${this.title}</span>
            <span class="popup3d1-close" title="关闭" id="${id}-close">×</span>
          </div>
          <div class="popup3d1-body">${this.html}</div>
        </div>
        `;

        let closeBtn = document.getElementById(id + '-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.removeDecorator.bind(this), false);
        }
    }

    /**
     * 移除弹窗装饰。
     */
    removeDecorator() {
        if (!this.decoratorOpen) return;
        this.decoratorOpen = false;
        this.container.remove();
    }
}


export { PopupWindow1Decorator };