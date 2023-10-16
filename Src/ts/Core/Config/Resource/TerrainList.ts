import { DataTypeEnum } from './DataTypeEnum';
import { ResourceItem } from './ResourceItem';

const TerrainList: ResourceItem[] = [
    {
        pid: '8fe81f58-9d74-d69b-77d6-0d74a8ed44aa',
        name: 'Cesium-在线地形',
        catalog: '地形图层',
        dataType: DataTypeEnum.terrain,
        showInTree: true,
        defaultLoad: false,
        offlineCache: true,
        netRootPaths:[
            'https://assets.ion.cesium.com/ap-northeast-1/asset_depot/1/CesiumWorldTerrain/'
        ],
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'default'
        }
    },
    {
        pid: 'edaa73e0-e49b-f701-f212-2556bc279dbd',
        name: '阿里云-中国地形',
        catalog: '地形图层',
        dataType: DataTypeEnum.terrain,
        showInTree: true,
        netRootPaths: [
            'http://127.0.0.1:3000/DBService/中国地形-加密/'
        ],
        defaultLoad: true,
        offlineCache: true,
        decryptionKey: 'SDcVrdKWEgjKPTGQgZ6zogd1U+ipK9DavJ1ewW36F8z8yqDX/9QVR4sAhynFg2Xy/ysWfNtq6fQxaQISn8YvJ4PIYdseKHRCfjGCJME7FOAhbfNve5S5UiBIfNj7fxarGWMMDlIRO/boCyI5n29pgERtTKl/XWDttQTh4gZbFhlguOTJWlryE1YUg4zcLtQdIV1mB90viuoEJNnwa7CG3GVXZD894LKiyZMx1OtkrP+IZyRIRe2mLaH55FHOhqIF',
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'http://127.0.0.1:3000/DBService/中国地形-加密/'
        }
    }
];

export { TerrainList };
