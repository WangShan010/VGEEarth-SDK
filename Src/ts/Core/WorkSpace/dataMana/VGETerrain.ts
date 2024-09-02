import { Cesium } from '../../Impl/Declare';
import { ResourceItem } from '../../Config/ResourceItem/ResourceItem';
import { TerrainProvider, Viewer } from 'cesium';
import { VGEData } from './impl/VGEData';
import {SceneUtils} from '../../../Utils/SceneUtils/index'

class VGETerrain extends VGEData<TerrainProvider> {
    constructor(viewer: Viewer) {
        super(viewer);
    }


    async addData(sourceItem: ResourceItem): Promise<TerrainProvider> {
        let scene = this.viewer.scene;
        let prop = sourceItem.properties;
        let url = prop.url;
        let queryParameters = prop.queryParameters || {};
        let scheme = prop.scheme || 'CesiumTerrainProvider';
        let terrainProvider: TerrainProvider;

        if (url === 'default') {
            terrainProvider = await Cesium.createWorldTerrainAsync({
                requestWaterMask: true,
                requestVertexNormals: true
            });
        } else {
            let resource = new Cesium.Resource({url, queryParameters});

            if (scheme === 'VRTheWorldTerrainProvider') {
                terrainProvider = await Cesium.VRTheWorldTerrainProvider.fromUrl(resource, {
                    credit: 'Terrain data courtesy VT M?K'
                });
            } else {
                terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(resource, {
                    requestVertexNormals: false,
                    requestWaterMask: false,
                    credit: void 0
                });
            }
        }

        this.removeAll();
        scene.terrainProvider = terrainProvider;
        this.sourcesItems.push(sourceItem);
        this.instancesMap.set(sourceItem.pid, terrainProvider);
        return terrainProvider;
    };

    async flyToByPid(pid: string): Promise<boolean> {
        let sourcesItem = this.getSourcesItemsByPid(pid);
        if (!sourcesItem) return false;

        let r = sourcesItem?.properties?.rectangle;

        if (r) {
            return new Promise(() => {
                this.viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(r.west, r.south, r.east, r.north)
                });
            });
        } else {
            return await SceneUtils.viewerFlyToLonLat(110, 40, 15000000);
        }
    }


    removeByPid(pid: string): boolean {
        let sourcesItem = this.getSourcesItemsByPid(pid);
        if (!sourcesItem) return false;
        return this.removeAll();
    }

    removeAll(): boolean {
        // 缺省球体地形（无地形数据）
        this.viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
        this.sourcesItems = [];
        this.instancesMap.clear();
        return true;
    }

    destroy(): boolean {
        return this.removeAll();
    }
}

export { VGETerrain };
