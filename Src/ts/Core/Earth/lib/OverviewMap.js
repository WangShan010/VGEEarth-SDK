import { Cesium } from '../../Impl/Declare';
// 鹰眼图 基于ol 构造函数中传入viewer 和map对象
class OverviewMap {
    constructor(viewer, map) {
        this.viewer = viewer;
        this.map = map;
        this.activateContainer = '';
        this.initEvent();
        this.activate();
        this.addMapData();
    }
    initEvent() {
        const ol = window.ol;
        this.viewer.scene.postRender.addEventListener(() => {
            if (this.activateContainer !== 'viewer')
                return;
            let rec = this.viewer.camera.computeViewRectangle();
            if (!rec) {
                console.log('rec is undefined');
                return;
            }
            let extent = [Cesium.Math.toDegrees(rec.west),
                Cesium.Math.toDegrees(rec.south),
                Cesium.Math.toDegrees(rec.east),
                Cesium.Math.toDegrees(rec.north)
            ];
            if (ol.extent.isEmpty(extent)) {
                return;
            }
            const coordinates = this.getPolygonByBbox(extent);
            this.feature.setGeometry(new ol.geom.Polygon(coordinates));
            this.map.getView().fit(extent, {
                padding: [50, 50, 50, 50]
            });
        });
    }
    getPolygonByBbox(bbox) {
        return [
            [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[1]],
                [bbox[2], bbox[3]],
                [bbox[0], bbox[3]],
                [bbox[0], bbox[1]]
            ]
        ];
    }
    addMapData() {
        const ol = window.ol;
        this.feature = new ol.Feature(new ol.geom.Polygon([
            [
                [75, 20],
                [75, 40],
                [120, 40],
                [120, 20],
                [75, 20]
            ]
        ]));
        let source = new ol.source.Vector({
            features: [this.feature]
        });
        this.layer = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                })
            })
        });
        this.map.addLayer(this.layer);
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
        this.viewer.container.onmouseenter = undefined;
        this.map.getViewport().onmouseenter = undefined;
        this.activateContainer = '';
        this.map.removeLayer(this.layer);
    }
    destroy() {
        this.deactivate();
    }
}
export { OverviewMap };
