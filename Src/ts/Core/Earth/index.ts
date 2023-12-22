/**
 * Earth 模块是整个框架的核心模块，用于创建地球的构造类
 *
 * @packageDocumentation
 */


import { Viewer } from 'cesium';
import { Cesium } from '../Impl/Declare';

import { DomMana } from './lib/DomMana';
import { getOptions2D } from './lib/getOptions2D';
import { getOptions3D } from './lib/getOptions3D';
import { loadSource2DData } from './lib/loadSource2DData';
import { loadSource3DData } from './lib/loadSource3DData';

import { initViewerStata } from './lib/initViewerStata';
import { initViewer2DStata } from './lib/initViewer2DStata';
import { sync2DView } from './lib/sync2DView';

import { debugMana } from './lib/deBugMana/debugMana';
import { initMonitorCoordinates } from './lib/initMonitorCoordinates';
import { createNavigation } from './lib/createNavigation';
import { createOL } from './lib/createOL';
import { OverviewMap } from './lib/OverviewMap';
import { LinkOLMap23D } from './lib/LinkOLMap23D';
import { WorkSpace } from '../WorkSpace/index';
import { EventMana } from '../EventMana/EventMana';
import * as ListenType from '../EventMana/impl/ListenType';
import { ScopeType } from '../EventMana/impl/ScopeType';
import { initViewer3DStata } from './lib/initViewer3DStata';
import { MeasureTool } from '../MeasureTool/index';
import { PlotTool } from '../PlotTool/index';
import { DrawShape } from '../DrawShape/index';
import { InfoBox } from './lib/InfoBox';
import { AsyncTool } from '../../Utils/index';
import { ConfigTool } from '../Config/ConfigTool';
import { DefaultConfig } from '../Config/DefaultConfig';

/**
 * 名称：用于创建地球的构造类
 *
 * 描述：核心模块，用于创建地球的构造类
 *
 *
 * @remarks
 * 命名空间：window.VGEEarth.Earth
 *
 * @example
 *
 * let earth = new VGEEarth.Earth('MapContainer');
 * earth.openDeBug();
 * earth.createNavigation();
 *
 */

class Earth {
    viewer2D: Viewer | undefined;
    viewer2DWorkSpace: WorkSpace | undefined;

    // 场景中的主 Viewer 对象
    viewer3D: Viewer;
    viewer3DWorkSpace: WorkSpace;
    viewerOl: any;

    is2D3D: boolean = false;
    isOpenOverviewMap: boolean = false;
    loadComplete: boolean = false;
    overviewMap: OverviewMap | undefined;
    linkOLMap23D: LinkOLMap23D | undefined;

    config = ConfigTool;

    drawShape: DrawShape;
    // 默认生成的量测工具
    measureTool: MeasureTool;
    // 默认生成的标绘工具
    plotTool: PlotTool;

    infoBox: InfoBox;
    // 初始化坐标与高度的监听
    initMonitorCoordinates = initMonitorCoordinates;

    /**
     * 创建新的 viewer 对象
     * @param domID     创建球的父容器（div 的 id）
     * @param option    viewer 的原参数，参照 new Cesium.Viewer(id,option)
     */
    constructor(domID: string, option = {}) {
        // 初始化 Dom 节点
        DomMana.initRootDom(domID);

        // let isPC = window.isPCBrowser = window.YaoDo.HTTPTool.isPc();

        // 载入用户手动定义的 Viewer3D 属性
        let options = getOptions3D();
        Object.assign(options, option);

        this.viewer3D = new Cesium.Viewer('viewer3DDom', options);
        this.initViewer3DScreenEvent();
        initViewerStata(this.viewer3D);
        initViewer3DStata(this.viewer3D);

        this.viewer3DWorkSpace = new WorkSpace(this.viewer3D, ScopeType.Viewer3D);
        EventMana.viewerEvent.raiseEvent(ListenType.ViewerEventType.init, ScopeType.Viewer3D, {});
        EventMana.viewerEvent.raiseEvent(ListenType.ViewerEventType.init, ScopeType.global, {});


        // 载入资源
        loadSource3DData(this.viewer3D, this.viewer3DWorkSpace).then(async () => {
            this.loadComplete = true;
        });
        // @ts-ignore
        window.earth = this;

        this.viewer3D.scene.debugShowFramesPerSecond = true;
        this.drawShape = new DrawShape(this.viewer3D);
        this.measureTool = new MeasureTool(this.viewer3D);
        this.plotTool = new PlotTool(this.viewer3D);
        this.infoBox = new InfoBox(this.viewer3D);

        // 调整鼠标滚轮缩放速度，默认为 5，太快了
        // @ts-ignore
        this.viewer3D.scene.screenSpaceCameraController._zoomFactor = 3;
    }

    async thenLoadComplete() {
        while (!this.loadComplete) {
            await AsyncTool.sleep(500);
        }
        return true;
    }

    // 开启 Cesium 二三维联动
    async openCesiumMapLink23d() {
        if (!this.viewer2D) {
            let viewer2D = new Cesium.Viewer('viewer2DDom', getOptions2D());
            let workSpace = new WorkSpace(viewer2D, ScopeType.Viewer2D);

            initViewerStata(viewer2D);
            // 每次3D相机视图更改时应用我们的同步功能
            this.viewer3D.camera.changed.addEventListener(sync2DView(this.viewer3D, viewer2D));
            // 默认情况下，“camera.changed”事件将在相机更改50%时触发,为了使它更敏感，我们可以降低这种敏感度
            this.viewer3D.camera.percentageChanged = 0.01;
            initViewer2DStata(viewer2D);
            await loadSource2DData(viewer2D, workSpace);
            EventMana.viewerEvent.raiseEvent(ListenType.ViewerEventType.init, ScopeType.Viewer2D, {});

            this.viewer2DWorkSpace = workSpace;
            this.viewer2D = viewer2D;
        }
        DomMana.initCesiumMapLink23d();
    }

    /**
     * // 关闭 Cesium 二三维联动*/
    closeCesiumMapLink23d() {
        DomMana.closeCesiumMapLink23d();
    }

    // 切换显示隐藏 2D视图
    toggleCesiumMapLink23d() {
        this.is2D3D ? this.closeCesiumMapLink23d() : this.openCesiumMapLink23d();
        this.is2D3D = !this.is2D3D;
    }

    // 开启鹰眼地图
    openOverviewMap() {
        DomMana.initOverviewMapDom();
        if (!this.viewerOl) {
            this.viewerOl = createOL();
        }
        if (!this.overviewMap) {
            this.overviewMap = new OverviewMap(this.viewer3D, this.viewerOl);
        }
        this.isOpenOverviewMap = true;
    }

    // 关闭鹰眼地图
    closeOverviewMap() {
        if (this.overviewMap) {
            this.overviewMap.destroy();
            this.overviewMap = undefined;
        }
        this.isOpenOverviewMap = false;
        DomMana.closeOverviewMapDom();
    }

    // 开启 OL 二三维联动
    openOLMapLink23d() {
        DomMana.initMapLink23d();
        if (!this.viewerOl) {
            this.viewerOl = createOL();
        }
        if (!this.linkOLMap23D) {
            this.linkOLMap23D = new LinkOLMap23D(this.viewer3D, this.viewerOl);
        }
        this.linkOLMap23D.activate();
    }

    // 关闭 OL 二三维联动
    closeOLMapLink23d() {
        if (this.linkOLMap23D) {
            DomMana.closeOLMapLink23d();
            this.linkOLMap23D.deactivate();
        }
    }

    // 切换显示 OL 二三维联动
    toggleOLMapLink23d() {
        this.is2D3D ? this.closeOLMapLink23d() : this.openOLMapLink23d();
        this.is2D3D = !this.is2D3D;
    }

    // 切换显示 OL 二三维联动
    toggleOverviewMap() {
        this.isOpenOverviewMap ? this.openOverviewMap() : this.closeOverviewMap();
        this.isOpenOverviewMap = !this.isOpenOverviewMap;
    }

    // 开启调试模式
    openDeBug() {
        let odTimer = setInterval(() => {
            if (this.loadComplete) {
                debugMana.open();
                window.CesiumNetworkPlug.OfflineCacheController.getDiskSpeed().then((e: any) => {
                    DefaultConfig.computerSpeed = e;
                });
                clearInterval(odTimer);
            }
        }, 100);
    }

    // 关闭调试模式
    closeDeBug() {
        debugMana.close();
    }

    // 清空 indexedDB 缓存数据
    clearCache() {
        const CesiumNetworkPlug = window.CesiumNetworkPlug;
        CesiumNetworkPlug.OfflineCacheController.clear();
    }

    getFPS() {
        // @ts-ignore
        const fpsText = this.viewer3D.scene._performanceDisplay._fpsText?.data;

        return Number(fpsText?.replace(' FPS', ''));
    }

    getCurrentJSPath() {
        let e = new Error('err');
        let stack = e.stack || '';
        let rgx = /(?:http|https|file):\/\/.*?\/.+?/;
        return (rgx.exec(stack) || [])[0] || '';
    }

    // 创建指北针
    createNavigation() {
        createNavigation(this.viewer3D);
    };

    // 初始化屏幕事件
    private initViewer3DScreenEvent() {
        let that = this;
        const viewer = that.viewer3D;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        for (const key in ListenType.ScreenSpaceEventType) {
            handler.setInputAction(function (movement: any) {
                EventMana.screenEvent.raiseEvent(Number(ListenType.ScreenSpaceEventType[key]), ScopeType.global, movement);
                EventMana.screenEvent.raiseEvent(Number(ListenType.ScreenSpaceEventType[key]), ScopeType.Viewer3D, movement);
            }, Cesium.ScreenSpaceEventType[key]);
        }

    }
}


export { Earth };
