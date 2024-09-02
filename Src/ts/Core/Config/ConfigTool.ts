import { ConfigImpl } from './ConfigImpl';
import { DefaultConfig } from './DefaultConfig';
import { ResourceItem } from './ResourceItem/ResourceItem';
import { AMapLayerList } from './Resource/AMapLayerList';
import { BingMapLayerList } from './Resource/BingMapLayerList';
import { MapBoxLayerList } from './Resource/MapBoxLayerList';
import { OSMLayersList } from './Resource/OSMLayerList';
import { TerrainList } from './Resource/TerrainList';
import { TianDiTuLayerList } from './Resource/TianDiTuLayerList';
import { DataTypeEnum } from './Enum/DataTypeEnum';
import { ResourceItemTool } from './ResourceItemTool';
import * as listenType from '../EventMana/impl/ListenType';
import { EventMana, ScopeType } from '../EventMana/index';


let config: ConfigImpl = DefaultConfig;

/**
 * 名称：SDK 配置参数 的操作工具
 */
const ConfigTool = {

    /**
     * 获取配置参数
     */
    get config() {
        // 设置页面标题
        window.document.title = config.appTitle;

        // 设置页面 Tabs 图标
        let links = [...document.getElementsByTagName('link')];
        let iconLink = links.find((item) => {
            return item.rel === 'shortcut icon' && item.type === 'image/x-icon';
        });
        if (!iconLink) {
            let link: HTMLLinkElement = document.createElement('link');
            link.href = <string>config.appIcon;
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        return config;
    },
    loadConfig(newConfig: ConfigImpl) {
        if (newConfig) {
            newConfig.Token && (config.Token = newConfig.Token);
            newConfig.appName && (config.appName = newConfig.appName);
            newConfig.appTitle && (config.appTitle = newConfig.appTitle);
            newConfig.homeView && (config.homeView = newConfig.homeView);
            newConfig.startAnimation && (config.startAnimation = newConfig.startAnimation);
            newConfig.AppBaseUrl && (config.AppBaseUrl = newConfig.AppBaseUrl);
            newConfig.GISResourcesUrl && (config.GISResourcesUrl = newConfig.GISResourcesUrl);

            Array.isArray(newConfig.layerList) && newConfig.layerList.length > 0 && (config.layerList.push(...newConfig.layerList));
            Array.isArray(newConfig.terrainList) && newConfig.terrainList.length > 0 && (config.terrainList.push(...newConfig.terrainList));
            Array.isArray(newConfig.modelList) && newConfig.modelList.length > 0 && (config.modelList.push(...newConfig.modelList));
            Array.isArray(newConfig.cesium3DTileSetList) && newConfig.cesium3DTileSetList.length > 0 && (config.cesium3DTileSetList.push(...newConfig.cesium3DTileSetList));
            Array.isArray(newConfig.geoJsonList) && newConfig.geoJsonList.length > 0 && (config.geoJsonList.push(...newConfig.geoJsonList));
            Array.isArray(newConfig.poiList) && newConfig.poiList.length > 0 && (config.poiList.push(...newConfig.poiList));

            newConfig.terrainList && checkTerrainList(newConfig.terrainList);
        }

        addUUId(config);
    },

    async addOSMOnLine(show = false) {
        const layer = JSON.parse(JSON.stringify(OSMLayersList[0]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addOSMElevationOnline(show = false) {
        const layer = JSON.parse(JSON.stringify(OSMLayersList[1]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },

    async addAMapSatelliteLayerOnLine(show = false) {
        const layer = JSON.parse(JSON.stringify(AMapLayerList[0]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addAMapLayerOnLine(show = false) {
        const layer = JSON.parse(JSON.stringify(AMapLayerList[1]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addAMapLayerHasLabelOnIon(show = false) {
        const layer = JSON.parse(JSON.stringify(AMapLayerList[2]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },

    async addMapBoxOnAliYun(show = false) {
        const layer = JSON.parse(JSON.stringify(MapBoxLayerList[0]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },

    async addBingMapOnIon(show = false) {
        const layer = JSON.parse(JSON.stringify(BingMapLayerList[0]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addBingMapHasLabelOnIon(show = false) {
        const layer = JSON.parse(JSON.stringify(BingMapLayerList[1]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addBingMapOnAliYun(show = false) {
        const layer = JSON.parse(JSON.stringify(BingMapLayerList[2]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },
    async addBingMapHasLabelOnAliYun(show = false) {
        const layer = JSON.parse(JSON.stringify(BingMapLayerList[3]));
        layer.defaultLoad = show;
        layer.show = show;
        await this.addResourceItem(layer);
    },


    async addTerrainOnIon(show = false) {
        const terrain = JSON.parse(JSON.stringify(TerrainList[0]));
        terrain.defaultLoad = show;
        terrain.show = show;
        await this.addResourceItem(terrain);
    },
    async addTerrainOnAliYun(show = false) {
        const terrain = JSON.parse(JSON.stringify(TerrainList[1]));
        terrain.defaultLoad = show;
        terrain.show = show;
        await this.addResourceItem(terrain);
    },
    async addTianDiTuLayerList(layer: string[]) {
        for (let i = 0; i < 6; i++) {
            const item = JSON.parse(JSON.stringify(TianDiTuLayerList[i]));
            if (layer.length > 0) {
                item.defaultLoad = layer.includes(item.properties.layer);
                item.show = layer.includes(item.properties.layer);
            }
            await this.addResourceItem(item);
        }
    },


    async addResourceItem(item: ResourceItem) {
        const resourceItem = ResourceItemTool.completeParams(item);
        if (this.getResourcesByPid(resourceItem.pid)) {
            console.log('无法向配置文件添加重复的资源项');
        } else {
            switch (String(resourceItem.dataType)) {
                case DataTypeEnum.layer: {
                    config.layerList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.terrain: {
                    config.terrainList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.gltf: {
                    config.modelList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.Cesium3DTile: {
                    config.cesium3DTileSetList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.geoJson: {
                    config.geoJsonList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.poi: {
                    config.poiList.push(resourceItem);
                }
                    break;
                case DataTypeEnum.water: {
                    console.log('暂不支持展示水体');
                }
                    break;
            }
            // if (resourceItem.show){
            //     try {
            //         const earth = getEarth();
            //         if (earth && earth.viewer3DWorkSpace) {
            //             console.log('加载，加载');
            //             await earth.viewer3DWorkSpace.addData(resourceItem);
            //         }
            //     } catch (e) {
            //
            //     }
            // }

            // 配置文件内的资源项发生变动，触发事件
            EventMana.sourceEvent.raiseEvent(listenType.DataEventType.addData, ScopeType.Viewer3D, resourceItem);
        }
        return resourceItem;
    },

    getResourcesByPid(pid: string) {
        return this.getAllSources().find(item => {
            return item.pid === pid;
        });
    },
    getAllSources() {
        let s = this.config;
        return [
            ...s.layerList,
            ...s.terrainList,
            ...s.modelList,
            ...s.cesium3DTileSetList,
            ...s.geoJsonList,
            ...s.poiList
        ];
    },
    setResourceParam(pid: string, key: string, value: any) {
        const resource = this.getResourcesByPid(pid);
        if (resource) {
            // @ts-ignore
            resource[key] = value;
        }
    },
    getBaseLayer() {
        let s = this.config;
        return s.layerList.find((item: ResourceItem) => {
            return item.dataType === 'layer' && item.properties.baseLayer;
        });
    },
    getBaseTerrain() {
        let s = this.config;
        return s.terrainList.find((item: ResourceItem) => {
            return item.dataType === 'terrain' && item.defaultLoad;
        });
    }
};

// 扫描全部的资源，缺失 pid 的需要补上，以方便管理
function addUUId(config: ConfigImpl) {
    config.layerList = filter(config.layerList);
    config.terrainList = filter(config.terrainList);
    config.modelList = filter(config.modelList);
    config.cesium3DTileSetList = filter(config.cesium3DTileSetList);
    config.geoJsonList = filter(config.geoJsonList);
    config.poiList = filter(config.poiList);

    function filter(sourcesArr: ResourceItem[] = []) {
        return sourcesArr.map(item => ResourceItemTool.completeParams(item));
    }

    return config;
}

// 地球上只能加载一个地形数据，需要检测地形数据配置是否错误（标记【默认加载】多份数据）
function checkTerrainList(terrainList: Array<any>) {
    let isLoad = false;
    if (terrainList.length > 0) {
        terrainList.map(item => {
            isLoad && (item.defaultLoad = false);
            item.defaultLoad && (isLoad = true);
            return item;
        });
    }

    return terrainList;
}

export { ConfigTool };
