import { DataTypeEnum } from '../Enum/DataTypeEnum';
import { ResourceItem } from '../ResourceItem/ResourceItem';

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
        name: 'Bing Maps Label',
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
    },
    {
        pid: '3d387f1d-7daa-e19b-63c4-06d0cb6f100d',
        name: 'Bing Maps',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            url: 'https://bj.webgpu.top:3006/mapServices/BingMaps/WMT/{z}/{x}/{y}.jpeg',
            scheme: 'WebMercatorTilingScheme2x2'
        }
    }
];

export { BingMapLayerList };
