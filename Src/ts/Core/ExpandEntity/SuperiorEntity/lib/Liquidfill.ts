import type { Cartesian3, Viewer } from 'cesium';
import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';

/**
 * @class 水球图，高度超过2000会消失
 */
class Liquidfill {
    position: Cartesian3;
    private viewer: Viewer;
    container: HTMLElement;
    WorldDegree: WorldDegree;
    option;
    domId;
    chart: any;

    /**
     * @constructor
     * @param {WorldDegree} WorldDegree 位置
     * @param {Viewer} viewer 当前viewer
     * @param {HTMLElement} container
     * @param option 要展示的DOM元素
     */
    constructor(viewer: Viewer, WorldDegree: WorldDegree, container: HTMLElement, option: any
    ) {
        this.viewer = viewer;
        this.WorldDegree = WorldDegree;
        this.position = new Cesium.Cartesian3.fromDegrees();
        this.option = option;
        this.domId = 'liquidfill_' + new Date().getTime();
        this.container = document.createElement('div');
        this.init();
    }

    async init() {
        this.container.style.display = 'none';
        this._addDom();
        let z = await getTerrainMostDetailedHeight(
            this.WorldDegree.longitude,
            this.WorldDegree.latitude
        );
        console.log(z);
        this.position = Cesium.Cartesian3.fromDegrees(
            this.WorldDegree.longitude,
            this.WorldDegree.latitude,
            z + (this.WorldDegree.height || 0)
        );
        this._addPostRender();
        this.initChart();
    }

    /**
     * 获取当前点的位置
     * @returns {Cartesian3}
     */
    getPosition(): Cartesian3 {
        return this.position;
    }

    _addPostRender() {
        this.viewer.scene.postRender.addEventListener(this._postRender, this);
    }

    _postRender() {
        if (!this.container || !this.container.style) return;
        if (!this.position) return;

        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.container.style.bottom = canvasHeight - windowPosition.y + 10 + 'px';
        const elWidth = this.container.offsetWidth;
        this.container.style.left = windowPosition.x - (elWidth / 2) + 'px';

        if (this.viewer.camera.positionCartographic.height > 5000) {
            this.container.style.display = 'none';
        } else {
            this.container.style.display = 'block';
        }
    }

    /**
     * 移除水球图dom元素，销毁图表
     */
    remove() {
        this.viewer.scene.postRender.removeEventListener(this._postRender, this); //移除事件监听
        this.chart.dispose(); //销毁图表
        this.viewer.cesiumWidget.container.removeChild(this.container); //删除DOM
    }

    /**
     * 创建水球图dom元素
     */
    _addDom() {
        this.container = document.createElement('div');
        this.container.style.cssText = 'position:absolute;height:80px;width:80px;pointer-events:none';
        this.container.setAttribute('id', this.domId);
        this.viewer.cesiumWidget.container.appendChild(this.container);
    }

    /**
     * 初始化图表
     */
    initChart() {
        // @ts-ignore
        this.chart = echarts.init(this.container);
        if (!this.option) this.option = this.getOption();
        this.chart.setOption(this.option);
    }

    /**
     * 水球图默认参数
     */
    getOption() {
        return {
            series: [{
                type: 'liquidFill',
                data: [0.51],
                radius: '90%',
                outline: {
                    show: false
                },
                label: {
                    position: ['50%', '65%'],
                    textStyle: {
                        fontSize: 15,
                        fontFamily: 'Lobster Two'
                    }
                },
                itemStyle: {
                    color: '#ff9501'
                }
            }]
        };
    }
}

export { Liquidfill };