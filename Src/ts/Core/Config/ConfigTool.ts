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


let config: ConfigImpl = DefaultConfig;

/**
 * 名称：SDK 配置参数 的操作工具
 *
 *  最后修改日期：2023-08-14
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

    /**
     * 加载 OSM 影像
     * @param show
     */
    addOSMOnLine(show = false) {
        config.layerList.push(...OSMLayersList.map(item => {
            item.defaultLoad = show;
            return item;
        }));
    },
    addMapBoxOnLine(show = false) {
        for (let i = 0; i < MapBoxLayerList.length; i++) {
            let layer = JSON.parse(JSON.stringify(MapBoxLayerList[i]));
            layer.defaultLoad = show;
            config.layerList.push(layer);
        }
    },
    addMapBoxOnAliYun(show = false) {
        let layer = JSON.parse(JSON.stringify(MapBoxLayerList[0]));
        layer.defaultLoad = show;
        config.layerList.push(layer);
    },
    addBingMapOnIon(show = false) {
        config.layerList.push(...BingMapLayerList.map(item => {
            item.defaultLoad = show;
            return item;
        }));
    },
    addTerrainOnIon(show = false) {
        let terrain = JSON.parse(JSON.stringify(TerrainList[0]));
        terrain.defaultLoad = show;
        config.terrainList.push(terrain);
    },
    addTerrainOnAliYun(show = false) {
        let terrain = JSON.parse(JSON.stringify(TerrainList[1]));
        terrain.defaultLoad = show;
        config.terrainList.push(terrain);
    },

    /**
     * 添加资源项
     * @param item
     */
    addSourcesItem(item: ResourceItem) {
        switch (String(item.dataType)) {
            case DataTypeEnum.layer: {
                config.layerList.push(item);
            }
                break;
            case DataTypeEnum.terrain: {
                config.terrainList.push(item);
            }
                break;
            case DataTypeEnum.gltf: {
                config.modelList.push(item);
            }
                break;
            case DataTypeEnum.Cesium3DTile: {
                config.cesium3DTileSetList.push(item);
            }
                break;
            case DataTypeEnum.geoJson: {
                config.geoJsonList.push(item);
            }
                break;
            case DataTypeEnum.poi: {
                config.poiList.push(item);
            }
                break;
            case DataTypeEnum.water: {
                console.log('展示不支持水体');
            }
                break;
        }
        addUUId(config);
        EventMana.configEvent.raiseEvent(ListenType.ConfigEventType.addData, ScopeType.global, {});
    },
    /**
     * 获取资源项
     * @param pid
     */
    getSourcesItemByPid(pid: string) {
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
            return item.dataType === 'layer' && item.defaultLoad && item.properties.baseLayer;
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
        sourcesArr.map(item => {
            item.pid = item.pid || SafeTool.uuid();
            item.defaultLoad = item.defaultLoad || false;
            item.showInTree = 'showInTree' in item ? item.showInTree : true;
        });

        return sourcesArr;
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
