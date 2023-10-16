import { ResourceItem } from '../../../Config/Resource/ResourceItem';

interface VGEDataImpl<T> {
    sourcesItems: ResourceItem[];
    instancesMap: Map<string, T>;

    addData(sourceItem: ResourceItem): Promise<any>;

    getSourcesItemsByPid(pid: string): ResourceItem | null;

    getInstancesByPid(pid: string): T | null;

    flyToByPid(pid: string): void;

    removeByPid(pid: string): boolean;

    removeAll(): boolean;
}

export { VGEDataImpl };
