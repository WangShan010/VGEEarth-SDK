import { DataTypeEnum } from './DataTypeEnum';
import { ResourceItem } from './ResourceItem';

const MapBoxLayerList: ResourceItem[] = [
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74ed44aa',
        name: '阿里云-全国影像',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        netRootPaths: [
            'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/TMS-mapbox.satellite/'
        ],
        offlineCache: false,
        decryptionKey: 'SDcVrdKWEgjKPTGQgZ6zop3OTsYo1T3nQ9FwlxROAySNOzXhmdjpVyDn0dMqcODWtC6+62uXM2jbMt24vgGxxHTkguhelh5LXi+zJ9666ryOhtqhvWrBMe9yr2mFNhIKpDsu+2hTSZG7wU5lDvE492Y+Wp0N8BCXOBjwIaaVSQo=',
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/TMS-mapbox.satellite/{z}/{x}/{y}.webp',
            minimumLevel: 0,
            maximumLevel: 10
        }
    }
];

export { MapBoxLayerList };
