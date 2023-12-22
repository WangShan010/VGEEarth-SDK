import { DataTypeEnum } from './DataTypeEnum';
import { ResourceItem } from './ResourceItem';

const AMapLayerList: ResourceItem[] = [
    {
        pid: 'ba4d5925-2278-0f89-444a-6640795adaa0',
        name: '高德影像',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
        }
    },
    {
        pid: '3e50b48c-3fe1-ccba-0935-304f5ffa0785',
        name: '高德电子地图',
        catalog: '电子地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'http://webst04.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'
        }
    }
];

export { AMapLayerList };
