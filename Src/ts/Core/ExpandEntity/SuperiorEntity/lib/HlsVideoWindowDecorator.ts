import { Cartesian3, Entity, Viewer } from 'cesium';
import { Cesium } from '../../../Impl/Declare';
import { getMainViewer } from '../../../Earth/lib/getMainViewer';
import { EventMana } from '../../../EventMana/EventMana';

/**
 * 定义了一个视频信息接口，包含视频标题、URL和类型。
 */
interface videoInfoImpl {
    title: string,
    url: string,
    type: 'mp4' | 'm3u8'
}

/**
 * HLS视频窗口装饰器类，用于处理视频弹出窗口的显示和交互逻辑。
 */
class HlsVideoWindowDecorator {
    #viewer: Viewer;
    #entity: Entity;
    #cartesian3Position: Cartesian3 | undefined;
    #clampToGround: boolean = true;
    #popup3dDom: any;
    #windowDom: HTMLDivElement;
    #windowOpen: boolean = false;
    #videoInfo: videoInfoImpl;
    #player: undefined;
    #eventInstance;

    /**
     * 构造函数，初始化实体和视频信息，并可选择是否贴地显示。
     * @param entity - Cesium实体对象
     * @param videoInfo - 视频信息对象
     * @param clampToGround - 是否贴地显示
     */
    constructor(entity: Entity, videoInfo: videoInfoImpl, clampToGround: boolean = false) {
        this.#viewer = getMainViewer();
        this.#entity = entity;
        this.#windowDom = document.createElement('div');
        this.#videoInfo = videoInfo;
        this.#clampToGround = clampToGround;
        this.#eventInstance = this.#clickEntity.bind(this);
        this.#entity.billboard! = new Cesium.BillboardGraphics({
            image: require('../../../../../img/marker/bluecamera.png'),
            scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
            // disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        });

        this.#addEvent();
    }

    /**
     * 创建视频弹出窗口的DOM元素并显示。
     */
    createDom() {
        this.#windowOpen = true;

        // 大窗体本身
        this.#windowDom.classList.add('video-popup3d-container');

        let headerDom = document.createElement('div');
        headerDom.classList.add('video-popup3d-header');
        this.#windowDom.appendChild(headerDom);

        let titleDom = document.createElement('span');
        titleDom.innerHTML = this.#videoInfo.title;
        titleDom.classList.add('video-popup3d-header-title');
        headerDom.appendChild(titleDom);

        let closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.classList.add('video-popup3d-close');
        headerDom.appendChild(closeBtn);
        closeBtn.addEventListener('click', this.closeWindow.bind(this), false);

        let popup3dDom = document.createElement('div');
        popup3dDom.classList.add('video-popup3d-body');
        this.#windowDom.appendChild(popup3dDom);
        this.#popup3dDom = popup3dDom;
        this.#viewer.cesiumWidget.container.append(this.#windowDom);

        //点击关闭按钮时关闭窗口
        closeBtn.onclick = (e) => {
            this.closeWindow();
        };
        this.#createVideo();
    }

    /**
     * 关闭视频弹出窗口。
     */
    closeWindow() {
        if (!this.#windowOpen) return;
        this.#player && this.#player;
        this.#viewer.scene.postRender.removeEventListener(this.#postRenderEvent.bind(this));
        this.#windowDom.innerHTML = '';
        this.#windowDom.remove();
        this.#windowOpen = false;
    }

    /**
     * 销毁对象，关闭弹出窗口并移除事件监听。
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
            that.createDom();
        }
    }

    /**
     * 创建视频播放器，并加载视频源。
     */
    #createVideo() {
        let that = this;
        let videoDom = document.createElement('video');
        videoDom.classList.add('video-js');
        videoDom.classList.add('vjs-default-skin');
        videoDom.setAttribute('controls', String(!0));
        videoDom.setAttribute('autoplay', 'autoplay');
        videoDom.setAttribute('preload', 'auto');
        videoDom.setAttribute('muted', String(true));
        that.#popup3dDom.appendChild(videoDom);

        let vId = 'vid' + new Date().getTime();
        videoDom.setAttribute('id', vId);

        let player = window.videojs(vId);
        player.ready(() => {
            let sources = [{
                src: that.#videoInfo.url,
                type: that.#videoInfo.type === 'm3u8' ? 'application/x-mpegURL' : null
            }];
            player.src(sources);
            player.load();
        });
        that.#player = player;
    }

    #postRenderEvent() {
        const canvasHeight = this.#viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();

        if (this.#entity.position) {
            this.#cartesian3Position = this.#entity.position.getValue(this.#viewer.clock.currentTime);
        } else {
            console.log('entity.position is undefined');
            return this.closeWindow();
        }

        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.#viewer.scene,
            this.#cartesian3Position,
            windowPosition
        );

        this.#windowDom.style.bottom = canvasHeight - windowPosition.y + 100 + 'px';
        this.#windowDom.style.left = windowPosition.x + 20 + 'px';
    }
}

export { HlsVideoWindowDecorator };