import { Cesium, WorldDegree } from '../../../Impl/Declare';
import { Viewer } from 'cesium';
import { EventMana } from '../../../EventMana/EventMana';
import { ScreenSpaceEventType } from '../../../EventMana/impl/ListenType';
import { ScopeType } from '../../../EventMana/impl/ScopeType';
import { getTerrainMostDetailedHeight } from '../../../../Utils/SceneUtils/getTerrainMostDetailedHeight';
import { SafeTool } from '../../../../Utils/index';

interface videoInfoImpl {
    id: string,
    name: string,
    url: string,
    position: WorldDegree
}

/**
 * 表示一个在 Cesium 地球上显示的 3D 视频窗口。
 */
class HlsVideoWindow {
    /**
     * 创建 HlsVideoWindow 的实例。
     * @param {Viewer} viewer - 要显示视频窗口的 Cesium 视图器。
     * @param {videoInfoImpl} videoInfo - 关于要显示的视频的信息。
     */
    private viewer: Viewer;
    position: WorldDegree;
    videoInfo: videoInfoImpl;
    isDestroyWindow: boolean;
    popup3dDom: any;
    containerDom: any;
    player: any;
    screenEvent;
    entity: any;

    constructor(viewer: Viewer, videoInfo: videoInfoImpl) {
        /**
         * Cesium 视图器实例。
         * @type {Viewer}
         */
        this.viewer = viewer;
        this.position = Cesium.Cartographic.fromDegrees(videoInfo.position.longitude, videoInfo.position.latitude);
        this.videoInfo = videoInfo;
        if (!this.videoInfo.id) {
            this.videoInfo.id = 'HlsVideoWindow' + SafeTool.uuid();
        }
        this.isDestroyWindow = false;
        this.screenEvent = EventMana.screenEvent;
    }

    /**
     * 加载视频窗口到 Cesium 地球上。
     */
    async load() {
        let that = this;
        let position = new Cesium.Cartesian3();
        if (!that.entity) {
            that.entity = that.viewer.entities.add({
                id: that.videoInfo.id,
                name: that.videoInfo.name,
                position: position,
                billboard: {
                    image: require('../../../../../img/marker/bluecamera.png'),
                    scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                    // disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                }
            });
        }
        let h = await getTerrainMostDetailedHeight(that.videoInfo.position.longitude, that.videoInfo.position.latitude);

        this.position = Cesium.Cartographic.fromDegrees(that.videoInfo.position.longitude, that.videoInfo.position.latitude, h);
        position = Cesium.Cartesian3.fromDegrees(that.videoInfo.position.longitude, that.videoInfo.position.latitude, h);
        that.entity.position = position;
        that.screenEvent.addEventListener(ScreenSpaceEventType.LEFT_CLICK, ScopeType.Viewer3D, that.clickEntity.bind(that));
    }

    /**
     * 处理与视频窗口关联的 Cesium 实体的点击事件。
     * @param {any} pick - 来自点击事件的 pick 信息（屏幕坐标）。
     */
    clickEntity(pick: any): void {
        if (pick && pick.position) {
            let entity = this.viewer.scene.pick(pick.position);
            let id = entity?.id?.id;
            if (this.videoInfo.id === id) {
                this.init();
            }
        }
    }

    /**
     * 通过创建和加载必要的元素来初始化视频窗口。
     */
    // 初始化
    async init() {
        this.closeWindow();
        this.createDom();
        this.load();
        this.addEvent();

        this.isDestroyWindow = false;
    }

    /**
     * 创建视频弹出窗口的 DOM 元素。
     */
    createDom() {
        this.containerDom = document.createElement('div');
        this.containerDom.classList.add('video-popup3d-container');
        let headerDom = document.createElement('div');
        headerDom.classList.add('video-popup3d-header');
        this.containerDom.appendChild(headerDom);

        let titleDom = document.createElement('span');
        titleDom.innerHTML = this.videoInfo.name;
        titleDom.classList.add('video-popup3d-header-title');
        headerDom.appendChild(titleDom);

        let closeDom = document.createElement('span');
        closeDom.innerHTML = '×';
        closeDom.classList.add('video-popup3d-close');
        headerDom.appendChild(closeDom);

        let popup3dDom = document.createElement('div');
        popup3dDom.classList.add('video-popup3d-body');
        this.containerDom.appendChild(popup3dDom);
        this.popup3dDom = popup3dDom;
        this.viewer.cesiumWidget.container.append(this.containerDom);

        //点击关闭按钮时关闭窗口
        closeDom.onclick = () => {
            this.closeWindow();
        };
        this.createVideo();
    }

    /**
     * 在弹出窗口的 DOM 中创建视频播放器。
     */
    createVideo() {
        let videoDom = document.createElement('video');
        videoDom.classList.add('video-js');
        videoDom.classList.add('vjs-default-skin');
        videoDom.setAttribute('controls', String(!0));
        videoDom.setAttribute('autoplay', 'autoplay');
        videoDom.setAttribute('preload', 'auto');
        videoDom.setAttribute('muted', String(true));
        this.popup3dDom.appendChild(videoDom);

        let vId = 'vid' + new Date().getTime();
        videoDom.setAttribute('id', vId);

        let player = window.videojs(vId);
        player.ready(() => {
            let sources = [{
                src: this.videoInfo.url,
                type: 'application/x-mpegURL'
            }];
            player.src(sources);
            player.load();
        });
        this.player = player;
    }

    /**
     * 添加必要的事件侦听器。
     */
    addEvent() {
        let that = this;
        this.viewer.scene.postRender.addEventListener(that.postRenderEvent, that);
    }

    /**
     * 处理用于定位弹出窗口的后渲染事件。
     */
    postRenderEvent() {
        let that = this;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            Cesium.Cartesian3.fromDegrees(that.videoInfo.position.longitude, that.videoInfo.position.latitude,
                that.position.height),
            windowPosition);
        this.containerDom.style.bottom = canvasHeight - windowPosition.y + 80 + 'px';
        this.containerDom.style.left = windowPosition.x + 20 + 'px';
    }

    //关闭
    closeWindow() {
        if (this.isDestroyWindow) return;
        this.player && this.player.dispose();
        this.viewer.scene.postRender.removeEventListener(this.postRenderEvent, this);
        this.containerDom && this.containerDom.remove();
        this.isDestroyWindow = true;
    }

    /**
     * 关闭视频窗口实例。
     */
    destroy() {
        this.closeWindow();
        this.viewer.entities.remove(this.entity);
    }
}

export { HlsVideoWindow };