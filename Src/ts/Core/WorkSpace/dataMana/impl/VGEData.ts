import { ResourceItem } from '../../../Config/Resource/ResourceItem';
import { VGEDataImpl } from './VGEDataImpl';
import { Viewer } from 'cesium';

abstract class VGEData<T> implements VGEDataImpl<T> {
    viewer: Viewer;
    sourcesItems: ResourceItem[];
    instancesMap: Map<string, T>;

    protected constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.sourcesItems = [];
        this.instancesMap = new Map<string, T>();
    }

    abstract addData(sourceItem: ResourceItem): Promise<any>;

    abstract flyToByPid(pid: string): Promise<boolean>;

    getInstancesByPid(pid: string) {
        return this.instancesMap.get(pid) || null;
    }

    getSourcesItemsByPid(pid: string) {
        return this.sourcesItems.find(item => item.pid === pid) || null;
    }

    abstract removeByPid(pid: string): boolean;

    removeAll(): boolean {
        this.sourcesItems.forEach(item => {
            this.removeByPid(item.pid);
        });
        return true;
    }

    abstract destroy(): boolean;
}

export { VGEData };
