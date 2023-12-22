import { ResourceItem } from './ResourceItem';
import { SafeTool } from '../../../Utils/index';

const ResourceItemTool = {

    // 检查资源项的合法性
    checkSourceItem(sourceItem: ResourceItem): boolean {
        let right = true;
        right = right && !!sourceItem;
        right = right && !!sourceItem.properties;

        if (sourceItem.decryptionKey) {
            if (!sourceItem.netRootPaths) {
                console.warn('参数异常，资源项的 netRootPaths 参数为必填！：', sourceItem);
                return false;
            }
        }
        if (sourceItem.offlineCache) {
            if (!sourceItem.netRootPaths) {
                console.warn('参数异常，资源项的 netRootPaths 参数为必填！：', sourceItem);
                return false;
            }
        }


        return right;
    },

    completeParams(sourceItem: ResourceItem): ResourceItem {
        sourceItem = JSON.parse(JSON.stringify(sourceItem));

        sourceItem.pid = sourceItem.pid || SafeTool.uuid();
        sourceItem.defaultLoad = sourceItem.defaultLoad || false;
        sourceItem.showInTree = 'showInTree' in sourceItem ? sourceItem.showInTree : true;
        sourceItem.netRootPaths = sourceItem.netRootPaths || [];


        return sourceItem;
    }

};


export { ResourceItemTool };
