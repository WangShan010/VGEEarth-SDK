/**
 * 名称：OL 二三维显示控制器
 *
 * @packageDocumentation
 */

import { Cesium } from '../../Impl/Declare';
import { Viewer } from 'cesium';

class LinkOLMap23D {
    private viewer: Viewer;
    private map;
    private activateContainer: string | null = null;

    constructor(viewer: Viewer, map: any) {
        this.viewer = viewer;
        this.map = map;
        this.activateContainer = null;
        this.initEvent();
        this.activate();
    }

    initEvent() {
        this.map.updateSize(); //监听地图容器大小，防止出现白边
        this.map.getView().on('change:center', () => {
            if (this.activateContainer == 'map') {
                this.scene2map();
            }
        });

        this.viewer.scene.postRender.addEventListener((e) => {
            if (this.activateContainer != 'viewer') return;
            this.map2scene();
        });
    }

    activate() {
        // @ts-ignore
        this.viewer.container.onmouseenter = () => {
            this.activateContainer = 'viewer';
        };
        this.map.getViewport().onmouseenter = () => {
            this.activateContainer = 'map';
        };
    }

    deactivate() {
        // @ts-ignore
        this.viewer.container.onmouseenter = null;
        this.map.getViewport().onmouseenter = null;
        this.activateContainer = null;
    }

    //地图同步到场景
    map2scene() {
        // this.map.getView().setRotation(-this.viewer.camera.heading);
        let rec = this.viewer.camera.computeViewRectangle();
        if (!rec) {
            console.log('rec is undefined');
            this.setMapCenterByCameraPosition();
            return;
        }
        let extent = [Cesium.Math.toDegrees(rec.west),
            Cesium.Math.toDegrees(rec.south),
            Cesium.Math.toDegrees(rec.east),
            Cesium.Math.toDegrees(rec.north)
        ];
        if (window.ol.extent.isEmpty(extent)) {
            console.log('ol 视角范围为 null');
            this.setMapCenterByCameraPosition();
            return;
        }
        this.map.getView().fit(extent);
    }

    //场景同步到地图
    scene2map() {
        let rec = this.map.getView().calculateExtent(this.map.getSize());
        this.viewer.camera.setView({
            destination: Cesium.Rectangle.fromDegrees(rec[0], rec[1], rec[2], rec[3])
        });
    }

    setMapCenterByCameraPosition() {
        let position = this.viewer.camera.position;
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        this.map.getView().setCenter([lon, lat]);
    }
}


export { LinkOLMap23D };