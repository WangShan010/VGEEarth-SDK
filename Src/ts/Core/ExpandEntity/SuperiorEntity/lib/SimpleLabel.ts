/****************************************************************************
 名称：简单标注点
 描述：..

 最后修改日期：2022-03-02
 ****************************************************************************/


import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { Viewer } from 'cesium';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * 表示一个简易标签类，用于在地图上显示自定义标签。
 */
class SimpleLabel {
    viewer;
    worldDegree: WorldDegree;

    isDestroyWindow: boolean;
    windowDom: HTMLDivElement;
    containerDom: HTMLElement;
    closeSurface: boolean;

    /**
     * 创建一个 SimpleLabel 实例。
     * @param viewer 视图器对象。
     * @param dom 标签的容器元素。
     * @param worldDegree 世界坐标信息。
     * @param closeSurface 是否在地表关闭。
     */
    constructor(viewer: Viewer, dom: HTMLElement, worldDegree: WorldDegree, closeSurface = true) {
        this.viewer = viewer;
        this.worldDegree = worldDegree;
        this.closeSurface = closeSurface;

        this.isDestroyWindow = false;

        this.windowDom = document.createElement('div');
        this.containerDom = dom || document.createElement('div');
    }

    /**
     * 初始化标签窗口。
     */
    async initWindow() {
        this.windowDom.style.display = 'none';
        this.isDestroyWindow = false;
        this.createDom();
        if (this.closeSurface) {
            this.worldDegree.height = await getTerrainMostDetailedHeight(
                this.worldDegree.longitude,
                this.worldDegree.latitude
            );
        }

        this.addEvent();
    }

    /**
     * 销毁标签窗口。
     */
    destroyWindow() {
        if (this.isDestroyWindow) return;
        this.isDestroyWindow = true;
        this.windowDom.remove();
        this.viewer.scene.postRender.removeEventListener(this.postRenderEvent, this);
    }

    /**
     * 创建标签的 DOM 元素。
     * @private
     */
    private createDom() {
        // 大窗体本身
        this.windowDom.classList.add('point-sample-label-container');

        // 关闭按钮
        let closeBtn = document.createElement('div');
        closeBtn.classList.add('point-sample-label-closeBtn');
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', this.destroyWindow.bind(this), false);
        this.windowDom.appendChild(closeBtn);

        // 窗体容器范围
        let label = document.createElement('div');
        label.classList.add('point-sample-label-text');
        label.appendChild(this.containerDom);
        this.windowDom.appendChild(label);

        this.viewer.cesiumWidget.container.appendChild(this.windowDom);
    }

    /**
     * 添加标签渲染事件监听。
     * @private
     */
    private addEvent() {
        let that = this;
        this.viewer.scene.postRender.addEventListener(that.postRenderEvent, that);
    }

    /**
     * 标签渲染后的事件处理。
     * @private
     */
    private postRenderEvent() {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            Cesium.Cartesian3.fromDegrees(this.worldDegree.longitude, this.worldDegree.latitude, this.worldDegree.height),
            windowPosition);

        this.windowDom.style.bottom = canvasHeight - windowPosition.y + 10 + 'px';
        this.windowDom.style.left = windowPosition.x + 20 + 'px';
        this.windowDom.style.display = 'block';
    }
}

export { SimpleLabel };
