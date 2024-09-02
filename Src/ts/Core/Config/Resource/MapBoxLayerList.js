import { DataTypeEnum } from '../Enum/DataTypeEnum';
const MapBoxLayerList = [
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74ed44aa',
        name: '阿里云-全国影像',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        netRootPaths: [],
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://bj.webgpu.top:3006/DBService/api.mapbox.com-globe-0-11/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}.jpeg',
            minimumLevel: 0,
            maximumLevel: 8
        }
    },
    {
        pid: 'a0e3058d-678c-8c87-128a-3a7b5e125939',
        name: 'MapBox Satellite',
        catalog: '基础影像',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: true,
        show: true,
        offlineCache: false,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?sku=101iWxRxn5B7w&access_token=pk.eyJ1Ijoic3ZjLW9rdGEtbWFwYm94LXN0YWZmLWFjY2VzcyIsImEiOiJjbG5sMnExa3kxNTJtMmtsODJld24yNGJlIn0.RQ4CHchAYPJQZSiUJ0O3VQ',
            minimumLevel: 0,
            maximumLevel: 22
        }
    }
];
export { MapBoxLayerList };
