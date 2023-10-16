import { Cesium } from '../../../Impl/Declare';
import { Viewer } from 'cesium';

/**
 * 表示一个 LED 标签。
 */
class LEDLabel {
    /** HTML 容器元素 */
    $htmlContainer: HTMLHeadingElement | undefined;

    /** Cesium 视图器 */
    #viewer: Viewer;

    /** 标签显示的位置 */
    #position;

    /** 标签的内容 */
    #label;

    /**
     * 创建一个 LEDLabel 的新实例。
     * @param viewer - Cesium 视图器
     * @param position - 标签显示的位置
     * @param label - 标签的内容
     */
    constructor(viewer: Viewer, position: string, label: string) {
        this.#viewer = viewer;
        this.#position = position;
        this.#label = label;
        this.initDom();
        this.initEvent();
    }

    /**
     * 初始化 DOM 元素。
     */
    initDom() {
        this.$htmlContainer = document.createElement('h3');
        this.$htmlContainer.classList.add('label-led-container');
        this.$htmlContainer.innerHTML = this.#label;
        // this.$htmlContainer.style.cssText="position: absolute;left: 0px;bottom: 0px;text-align: center;font-family: 'LED';font-size: 24px;font-weight: 100;margin: 0px;pointer-events: none;background-image: -webkit-linear-gradient(bottom, red, #fd8403, yellow);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
        this.#viewer.cesiumWidget.container.appendChild(this.$htmlContainer);
        // @ts-ignore
        //this.#viewer.scene.postRender.addEventListener(this.postRenderEvent, this);
    }

    /**
     * 初始化事件监听。
     */
    initEvent() {
        this.#viewer.scene.postRender.addEventListener(this.postRenderEventHandle, this);
    }

    /**
     * 处理渲染后事件。
     */
    postRenderEventHandle() {
        const canvasHeight = this.#viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.#viewer.scene, this.#position, windowPosition);
        // @ts-ignore
        this.$htmlContainer.style.bottom = canvasHeight + 30 - windowPosition.y + 'px';
        // console.log(canvasHeight + 30 - windowPosition.y + "px")

        // @ts-ignore
        const elWidth = this.$htmlContainer.offsetWidth;
        // @ts-ignore
        this.$htmlContainer.style.left = windowPosition.x - (elWidth / 2) + 'px';


        const cameraPosition = this.#viewer.camera.position;
        let height = this.#viewer.scene.globe.ellipsoid.cartesianToCartographic(cameraPosition).height;
        height += this.#viewer.scene.globe.ellipsoid.maximumRadius;
        if (!(Cesium.Cartesian3.distance(cameraPosition, this.#position) > height)) {
            // @ts-ignore
            this.$htmlContainer.style.display = 'block';
            if (this.#viewer.camera.positionCartographic.height > 400000) {
                // @ts-ignore
                this.$htmlContainer.style.display = 'none';
            } else {
                // @ts-ignore
                this.$htmlContainer.style.display = 'block';
            }
        } else {
            // @ts-ignore
            this.$htmlContainer.style.display = 'none';
        }
    }

    /**
     * 移除标签。
     */
    remove() {
        // @ts-ignore
        this.$htmlContainer.parentNode.removeChild(this.$htmlContainer);
        this.#viewer.scene.postRender.removeEventListener(this.postRenderEventHandle, this);
    }
}

export { LEDLabel };
