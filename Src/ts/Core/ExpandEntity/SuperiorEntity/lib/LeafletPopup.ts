import { Cesium } from '../../../Impl/Declare';
import { Cartesian3, Viewer } from 'cesium';

/**
 * @class leaflet风格弹窗
 */
class LeafletPopup {
    private viewer: Viewer;
    position: Cartesian3;
    fields: [];
    values: [];
    $container: any;
    $body: any;

    /**
     * @constructor
     * @param { Viewer } viewer 当前视图
     * @param { Cartesian3 {x:number; y:number; z:number;} } position 点击事件发生的在三维地球上的位置
     * @param { [] } fields 模型数据的属性字段
     * @param { [] } values 模型数据的各属性字段所对应值
     */
    constructor(viewer: Viewer, position: Cartesian3, fields: [], values: []) {
        this.viewer = viewer;
        this.position = position;
        this.fields = fields;
        this.values = values;
        this.init();
    }

    //初始化
    init() {
        this.createDom();
        this.addEvent();
    }

    //创建DOM节点
    createDom() {
        let $container = document.createElement('div');
        $container.classList.add('leaflet-popup-container');

        let $close = document.createElement('span');
        $close.innerHTML = '×';
        $close.classList.add('leaflet-popup-close-button');
        $container.appendChild($close);

        let $body = document.createElement('div');
        $body.classList.add('leaflet-popup-content-wrapper');
        $container.appendChild($body);
        this.createContent($body);

        let $tipcontainer = document.createElement('div');
        $tipcontainer.classList.add('leaflet-popup-tip-container');
        $container.appendChild($tipcontainer);

        let $tip = document.createElement('div');
        $tip.classList.add('leaflet-popup-tip');
        $tipcontainer.appendChild($tip);

        this.$container = $container;
        this.$body = $body;
        this.viewer.cesiumWidget.container.append($container);
        //点击关闭按钮时关闭窗口
        $close.onclick = (e) => {
            this.close();
        };
    }

    //创建相应的leaflet窗口内容body
    createContent($body: any) {
        let html = '';
        for (let i = 0; i < this.values.length; i++) {
            html += `
                <tr>
                  <td><label style="color:#e0f102;">${this.fields[i]}</label>：${this.values[i]}</td>
                </tr>`;
        }
        let content = ` <table>${html}</table> `;
        $body.innerHTML = content;
    }

    //添加事件监听
    addEvent() {
        this.viewer.scene.postRender.addEventListener(this.postRenderEvent, this);
    }

    //场景渲染事件 实时更新标签的位置 使其与笛卡尔坐标一致
    postRenderEvent() {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.$container.style.bottom = canvasHeight - windowPosition.y + 30 + 'px';

        const elWidth = this.$container.offsetWidth;
        this.$container.style.left = windowPosition.x - (elWidth / 2) + 'px';

        if (this.viewer.camera.positionCartographic.height > 4000) {
            this.$container.style.display = 'none';
        } else {
            this.$container.style.display = 'block';
        }
    }

    //关闭
    close() {
        this.viewer.scene.postRender.removeEventListener(this.postRenderEvent, this);
        this.$container.remove();
    }
}

export { LeafletPopup };