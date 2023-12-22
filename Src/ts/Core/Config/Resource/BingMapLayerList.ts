import { DataTypeEnum } from './DataTypeEnum';
import { ResourceItem } from './ResourceItem';

const BingMapLayerList: ResourceItem[] = [
    {
        pid: 'dd7813c4-dd2c-2ce4-7ff3-af62a8b97255',
        name: 'Bing Maps Aerial',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'IonImageryProvider',
            assetId: 2
        }
    },
    {
        pid: '5bc9728a-2ad1-8160-70c1-9ae4a14876a3',
        name: 'Bing Maps - 带标注',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'IonImageryProvider',
            assetId: 3
        }
    }
];

export { BingMapLayerList };
