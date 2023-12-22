import { ConfigImpl } from './ConfigImpl';
import { DefaultConfig } from './DefaultConfig';
import * as ListenType from '../EventMana/impl/ListenType';
import { EventMana } from '../EventMana/EventMana';
import { ScopeType } from '../EventMana/impl/ScopeType';
import { ResourceItem } from './Resource/ResourceItem';
import { OSMLayersList } from './Resource/OSMLayerList';
import { MapBoxLayerList } from './Resource/MapBoxLayerList';
import { TerrainList } from './Resource/TerrainList';
import { BingMapLayerList } from './Resource/BingMapLayerList';
import { DataTypeEnum } from './Resource/DataTypeEnum';
import { SafeTool } from '../../Utils/YaoDo/Source/SafeTool';
import { ResourceItemTool } from './Resource/ResourceItemTool';
import { getEarth } from '../Earth/lib/getEarth';
import { AMapLayerList } from './Resource/AMapLayerList';


let config: ConfigImpl = DefaultConfig;

/**
 * 名称：SDK 配置参数 的操作工具
 *
 *  重要的核心模块！本模块是开发人员控制 SDK 配置参数行为的重要途径。
 *  可以通过本模块的方法，对系统的全局配置参数进行导出、导入、编辑等操作。
 *
 *  还可以通过本模块的方法，向系统中添加资源项，包括地形、影像、模型、矢量数据等。
 *
 *  最后修改日期：2023-08-14
 *
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
            try {
                const earth = getEarth();
                if (earth && earth.viewer3DWorkSpace) {
                    await earth.viewer3DWorkSpace.addData(resourceItem);
                }
            } catch (e) {

            }
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
