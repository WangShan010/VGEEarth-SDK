/****************************************************************************
 名称：工作区管理器

 描述：工作区是一个资源管理器，存放着【当前地球上】已载入各种类型的资源，包括：图层、地形、模型、无人机倾斜摄影模型，
 以及在开发 SDK 时，我们自定义的各种类型资源，例如水体特效等。
 初始化地球后会将资源配置信息从【配置文件】中读取，载入工作区。工作区负责将这些资源进行统一管理，载入 Viewer，并且提供资源的访问接口。


 最后修改日期：2022-04-06
 ****************************************************************************/

import { Viewer } from 'cesium';

import { VGELayer } from './dataMana/VGELayer';
import { VGEPoi } from './dataMana/VGEPoi';
import { VGETerrain } from './dataMana/VGETerrain';
import { VGE3DTiles } from './dataMana/VGE3DTiles';
import { VGEGeoJson } from './dataMana/VGEGeoJson';
import { ResourceItem } from '../Config/Resource/ResourceItem';
import { DataTypeEnum } from '../Config/Resource/DataTypeEnum';
import { VGEGLTF } from './dataMana/VGEGLTF';
import { VGEWater } from './dataMana/VGEWater';
import * as listenType from '../EventMana/impl/ListenType';
import { ScopeType } from '../EventMana/impl/ScopeType';
import { SourceEvent } from '../EventMana/lib/SourceEvent';
import { EventMana } from '../EventMana/EventMana';
import { AsyncTool } from '../../Utils/index';
import { ResourceItemTool } from '../Config/Resource/ResourceItemTool';

class WorkSpace {
    private readonly scopeType: ScopeType;
    private viewer: Viewer;
    private sourceEvent: SourceEvent;


    public terrainMana: VGETerrain;
    public layerMana: VGELayer;
    public poiMana: VGEPoi;
    public _3DTileMana: VGE3DTiles;
    public geoJsonMana: VGEGeoJson;
    public gltfMana: VGEGLTF;
    public waterMana: VGEWater;

    constructor(viewer: Viewer, scopeType: ScopeType) {
        this.scopeType = scopeType;
        this.viewer = viewer;

        this.terrainMana = new VGETerrain(viewer);
        this.layerMana = new VGELayer(viewer);
        this.gltfMana = new VGEGLTF(viewer);
        this.poiMana = new VGEPoi(viewer);
        this._3DTileMana = new VGE3DTiles(viewer);
        this.geoJsonMana = new VGEGeoJson(viewer);
        this.waterMana = new VGEWater(viewer);

        this.sourceEvent = EventMana.sourceEvent;
        this.listenSource();
    }

    // 监听 Cesium 球上的数据变化
    listenSource = () => {
        // 监听图层集合的变化，如果没有通过工作区的增删方法来操作地球，工作区也要进行状态同步
        this.viewer.scene.globe.imageryLayersUpdatedEvent.addEventListener(async () => {
            await AsyncTool.sleep(100);
            this.getNodes().forEach((node) => {
                if (node.dataType === 'layer') {
                    // @ts-ignore
                    let layer = this.viewer.imageryLayers._layers.find((layer) => {
                        let param = layer.param || {};
                        return param.pid === node.pid;
                    });

                    if (!layer) {
                        // 如果图层不存在，则删除该节点
                        this.removeDataByPid(node.pid);
                        this.sourceEvent.raiseEvent(listenType.DataEventType.removeData, ScopeType.Viewer3D, {});
                    }
                }
            });
        });
    };

    // 加载数据
    addData = async (sourceItem: ResourceItem) => {
        let resourceInstance = null;
        let loadErr;

        if (!ResourceItemTool.checkSourceItem(sourceItem)) {
            console.log('该资源项不合法', sourceItem);
            return null;
        } else {
            sourceItem = ResourceItemTool.completeParams(sourceItem);
        }


        let old = this.getNodes().find(item => sourceItem.pid === item.pid);
        if (old) {
            console.warn('工作区已加载该数据!不允许重复加载：', sourceItem.name);
            return this.getInstances(sourceItem.pid);
        } else {
            let mes = ScopeType[this.scopeType] + ' 正在加载数据：' + sourceItem.name;

            mes = sourceItem.offlineCache ? mes + '，已开启 IndexDB 缓存' : mes;
            console.info('%c' + mes, 'color:green');
        }

        // 添加解密规则
        if (sourceItem.decryptionKey) {
            sourceItem.netRootPaths?.forEach(host => {
                window.CesiumNetworkPlug.DecryptionController.ruleMap.set(sourceItem.netRootPaths, sourceItem.decryptionKey);
            });
        }
        // 添加缓存规则
        if (sourceItem.offlineCache) {
            sourceItem.netRootPaths?.forEach(host => {
                window.CesiumNetworkPlug.OfflineCacheController.ruleList.add(host);
            });
        }


        // 注释
        switch (String(sourceItem.dataType)) {
            case DataTypeEnum.layer:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.layerMana.addData(sourceItem));
                break;
            case DataTypeEnum.terrain:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.terrainMana.addData(sourceItem));
                break;
            case DataTypeEnum.gltf:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.gltfMana.addData(sourceItem));
                break;
            case DataTypeEnum.Cesium3DTile:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this._3DTileMana.addData(sourceItem));
                break;
            case DataTypeEnum.geoJson:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.geoJsonMana.addData(sourceItem));
                break;
            case DataTypeEnum.water:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.waterMana.addData(sourceItem));
                break;
            case DataTypeEnum.poi:
                [loadErr, resourceInstance] = await AsyncTool.awaitWrap(this.poiMana.addData(sourceItem));
                break;
            default: {
                console.log('无效资源项');
            }
        }

        if (loadErr) {
            console.error('加载数据失败：', sourceItem.name, loadErr);
            return null;
        }


        // 添加数据到数组中
        this.sourceEvent.raiseEvent(listenType.DataEventType.addData, this.scopeType, sourceItem);

        return resourceInstance;
    };

    // 移除数据
    removeDataByPid = (pid: string): boolean => {
        let sourceItem = this.getNodeByPid(pid);
        let removeRes = false;
        removeRes = removeRes || this.layerMana.removeByPid(pid);
        removeRes = removeRes || this.terrainMana.removeByPid(pid);
        removeRes = removeRes || this._3DTileMana.removeByPid(pid);
        removeRes = removeRes || this.geoJsonMana.removeByPid(pid);
        removeRes = removeRes || this.waterMana.removeByPid(pid);
        removeRes = removeRes || this.gltfMana.removeByPid(pid);
        removeRes = removeRes || this.poiMana.removeByPid(pid);

        if (removeRes) {
            this.sourceEvent.raiseEvent(listenType.DataEventType.removeData, this.scopeType, sourceItem);
        }

        return removeRes;
    };

    // 飞向资源
    flyToDataByPid = (pid: string) => {
        this.layerMana.getSourcesItemsByPid(pid) && this.layerMana.flyToByPid(pid);
        this.terrainMana.getSourcesItemsByPid(pid) && this.terrainMana.flyToByPid(pid);
        this._3DTileMana.getSourcesItemsByPid(pid) && this._3DTileMana.flyToByPid(pid);
        this.geoJsonMana.getSourcesItemsByPid(pid) && this.geoJsonMana.flyToByPid(pid);
        this.waterMana.getSourcesItemsByPid(pid) && this.waterMana.flyToByPid(pid);
        this.gltfMana.getSourcesItemsByPid(pid) && this.gltfMana.flyToByPid(pid);
        this.poiMana.getSourcesItemsByPid(pid) && this.poiMana.flyToByPid(pid);
    };

    getNodeByPid = (pid: string) => {
        return this.getNodes().find(item => item.pid === pid);
    };

    getNodes() {
        let nodes: ResourceItem[] = [];
        nodes = nodes.concat(this.layerMana.sourcesItems);
        nodes = nodes.concat(this.terrainMana.sourcesItems);
        nodes = nodes.concat(this._3DTileMana.sourcesItems);
        nodes = nodes.concat(this.geoJsonMana.sourcesItems);
        nodes = nodes.concat(this.waterMana.sourcesItems);
        nodes = nodes.concat(this.gltfMana.sourcesItems);
        nodes = nodes.concat(this.poiMana.sourcesItems);
        return nodes;
    }

    getInstances(pid: string) {
        let instances: any = this.layerMana.instancesMap.get(pid);
        instances = instances || this.terrainMana.instancesMap.get(pid);
        instances = instances || this._3DTileMana.instancesMap.get(pid);
        instances = instances || this.geoJsonMana.instancesMap.get(pid);
        instances = instances || this.waterMana.instancesMap.get(pid);
        instances = instances || this.gltfMana.instancesMap.get(pid);
        instances = instances || this.poiMana.instancesMap.get(pid);

        return instances;
    }
}

export { WorkSpace };
