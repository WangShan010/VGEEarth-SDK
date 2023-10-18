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
        offlineCache: true,
        netRootPaths: [
            'http://ecn.t0.tiles.virtualearth.net/tiles/',
            'http://ecn.t1.tiles.virtualearth.net/tiles/',
            'http://ecn.t2.tiles.virtualearth.net/tiles/',
            'http://ecn.t3.tiles.virtualearth.net/tiles/',
            'https://ecn.t0.tiles.virtualearth.net/tiles/',
            'https://ecn.t1.tiles.virtualearth.net/tiles/',
            'https://ecn.t2.tiles.virtualearth.net/tiles/',
            'https://ecn.t3.tiles.virtualearth.net/tiles/'
        ],
        properties: {
            scheme: 'IonImageryProvider',
            assetId: 2
        }
    }
];

export { BingMapLayerList };
