import { Event, GeoJsonDataSource, Viewer } from 'cesium';
import { Cesium } from '../../../Impl/Declare';

/**
 * 表示一种用于配置点聚合功能的选项类型。
 */
type optionType = {
    billboardImg?: string;
    pixelRange?: number;
    minimumClusterSize?: number;
    billboard?: boolean;
    point?: boolean;
    label?: boolean;
    isExample?: boolean;
};

class PointCluster1 {
    /**
     * 数据加载事件。
     */
    public DataLoadedEvent: Event;
    #viewer: Viewer;
    #data: string;
    #options: optionType;
    #isShow: boolean;
    #removeListener: any;
    #geoJsonDataSource: GeoJsonDataSource;

    /**
     * 创建一个 PointCluster1 实例。
     * @param viewer 视图器。
     * @param data 数据。
     * @param options 选项。
     */
    constructor(viewer: Viewer, data: string, options: optionType) {
        this.#viewer = viewer;
        this.#data = data;
        this.#options = options || {};
        this.DataLoadedEvent = new Cesium.Event();
        this.#geoJsonDataSource = new Cesium.GeoJsonDataSource();
        this.#isShow = false;
    }

    /**
     * 初始化点聚合。
     */
    public init() {
        this.#isShow = true;
        this.#addDatasource();
    }

    /**
     * 获取选项。
     * @returns 当前选项。
     */
    public getOptions() {
        return this.#options;
    }

    /**
     * 销毁
     */
    public destroy() {
        if (this.#isShow) {
            this.#geoJsonDataSource.clustering.clusterEvent.removeEventListener(
                this.#removeListener
            );
            this.#viewer.dataSources.remove(this.#geoJsonDataSource);
        }
    }

    /**
     * 添加GeoJsonDataSource
     */
    #addDatasource() {
        let dataSource: Promise<GeoJsonDataSource> = new Cesium.GeoJsonDataSource().load(this.#data);
        dataSource.then((geoJsonDataSource) => {
            this.#geoJsonDataSource = geoJsonDataSource;
            this.#viewer.dataSources.add(geoJsonDataSource);
            // this.DataLoadedEvent.raiseEvent(geoJsonDataSource);
            geoJsonDataSource.clustering.enabled = true;
            //设置像素
            geoJsonDataSource.clustering.pixelRange = this.#options.pixelRange || 30;
            geoJsonDataSource.clustering.minimumClusterSize = this.#options.minimumClusterSize || 3;
            this.#setClusterEvent(geoJsonDataSource);
            //设置相机的图标
            geoJsonDataSource.entities.values.forEach((entity) => {
                // billboard图标
                entity.billboard!.image = this.#options.billboardImg || require('../../../../../img/marker/bluecamera.png');
                // @ts-ignore
                entity.type = 'cluster1';
            });
        });
    }

    // 设置聚合事件
    #setClusterEvent(geoJsonDataSource: GeoJsonDataSource) {
        this.#removeListener =
            geoJsonDataSource.clustering.clusterEvent.addEventListener(
                (clusteredEntities, cluster) => {
                    cluster.billboard.id = cluster.label.id;
                    // 是否显示
                    cluster.billboard.show = this.#determineDisplay(
                        this.#options.billboard,
                        true
                    );
                    cluster.point.show = this.#determineDisplay(
                        this.#options.point,
                        false
                    );
                    cluster.label.show = this.#determineDisplay(
                        this.#options.label,
                        false
                    );
                    // 位置
                    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
                    cluster.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                    cluster.point.disableDepthTestDistance = Number.POSITIVE_INFINITY;
                    // cluster.point.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                    cluster.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
                    cluster.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
                    // 聚合图标
                    if (this.#options.isExample) {
                        if (clusteredEntities.length >= 300) {
                            cluster.billboard.image = require('../../../../../img/pointcluster/300+.png');
                        } else if (clusteredEntities.length >= 150) {
                            cluster.billboard.image = require('../../../../../img/pointcluster/150+.png');
                        } else if (clusteredEntities.length >= 90) {
                            cluster.billboard.image = require('../../../../../img/pointcluster/90+.png');
                        } else if (clusteredEntities.length >= 30) {
                            cluster.billboard.image = require('../../../../../img/pointcluster/30+.png');
                        } else if (clusteredEntities.length > 10) {
                            cluster.billboard.image = require('../../../../../img/pointcluster/10+.png');
                        } else {
                            cluster.billboard.image = require(`../../../../../img/pointcluster/${clusteredEntities.length}.png`);
                        }
                    } else {
                        cluster.billboard.image = this.#options.billboardImg || require('../../../../../img/marker/bluecamera.png');
                    }
                }
            );
    }

    /**
     * 判断ture或false或undefined,用于是否显示billboard,point,label是否显示
     * @param para 待判断参数
     * @param def 默认
     */
    #determineDisplay(para: boolean | undefined, def: boolean) {
        if (para === undefined) {
            return def;
        } else {
            return para;
        }
    }
}


export { PointCluster1 };