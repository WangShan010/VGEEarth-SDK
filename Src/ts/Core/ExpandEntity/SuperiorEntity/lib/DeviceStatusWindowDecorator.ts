import { Entity } from 'cesium';
import { Cesium } from '../../../Impl/Declare';
import { BaseDecorator } from '../impl/BaseDecorator';
import { SafeTool } from '../../../../Utils/YaoDo/Source/SafeTool';

/**
 * 表示可自定义弹出实体
 */
class DeviceStatusWindowDecorator extends BaseDecorator {

    title: string;
    html: string | HTMLElement;
    color: string;
    container: HTMLDivElement;
    private id: string;

    /**
     * 创建可自定义的弹出窗口。
     * @param {Entity} entity - 底层的 Cesium 实体。
     * @param {Object} params - 自定义参数。
     * @param {string} params.title - 弹出窗口的标题。
     * @param {string|HTMLElement} params.html - 弹出窗口的 HTML 内容。
     * @param {string} params.color - 弹出窗口的颜色。
     * @param {HTMLDivElement} params.container - 弹出窗口的容器元素。
     * @param {string} [clampToGround=false] - 实体是否贴地显示。
     */
    constructor(entity: Entity, params: any = {}, clampToGround: boolean = false) {
        super(entity, params, clampToGround);
        /**
         * 弹出窗口的标识符。
         *
         */
        this.id = SafeTool.uuid();
        /**
         * 弹出窗口的标题。

         */
        this.title = params.title || '弹窗';
        /**
         * 弹出窗口的 HTML 内容。
         * @type {string|HTMLElement}
         */
        this.html = params.html || '测试div';
        this.color = 'green';
        if (params.color === 'green' || params.color === 'yellow') {
            this.color = params.color;
        }
        /**
         * 弹出窗口的容器元素。
         * @type {HTMLDivElement}
         */
        this.container = document.createElement('div');
        this.viewer.selectedEntityChanged.addEventListener(e => {
            if (entity?.id !== e?.id && this.decoratorOpen) {
                this.viewer.trackedEntity = undefined;
                this.removeDecorator();
            }
        });

    }

    postRenderEvent() {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        let position = this.entity.position?.getValue(this.viewer.clock.currentTime);

        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            position,
            windowPosition
        );

        this.container.style.position = 'absolute';
        this.container.style.bottom = canvasHeight - windowPosition.y + 50 + 'px';
        this.container.style.left = windowPosition.x - 10 + 'px';

        if (this.container.classList.contains('device-status-container-green') && this.color === 'yellow') {
            this.container.classList.remove('device-status-container-green');
            this.container.classList.add('device-status-container-yellow');
        } else if (this.container.classList.contains('device-status-container-yellow') && this.color === 'green') {
            this.container.classList.remove('device-status-container-yellow');
            this.container.classList.add('device-status-container-green');
        }

        let deviceTitle = this.container.querySelector('.device-title');
        if (deviceTitle) {
            deviceTitle.innerHTML = this.title;
        }

        let deviceName = this.container.querySelector('.device-name');
        if (deviceName) {
            if (this.html instanceof HTMLElement) {
                deviceName.innerHTML = '';
                // deviceName.appendChild(this.html);
            } else {
                deviceName.innerHTML = this.html;
            }
        }
    };

    /**
     * 创建并显示弹出窗口装饰器。
     */
    createDecorator() {
        if (this.decoratorOpen) return;
        this.decoratorOpen = true;
        this.viewer.cesiumWidget.container.appendChild(this.container);

        this.container.classList.add('device-status-container');
        this.container.classList.add(`device-status-container-${this.color}`);
        let title = document.createElement('div');
        title.classList.add('device-title');
        this.container.appendChild(title);
        title.innerHTML = this.title;

        let body = document.createElement('div');
        body.classList.add('device-name');
        this.container.appendChild(body);
        if (this.html instanceof HTMLElement) {
            body.appendChild(this.html);
        } else {
            body.innerHTML = this.html;
        }
    }

    /**
     * 移除弹出窗口装饰器。
     */
    removeDecorator() {
        if (!this.decoratorOpen) return;
        this.decoratorOpen = false;
        this.container.innerHTML = '';
        this.container.remove();
    }
}

export { DeviceStatusWindowDecorator };
