import { ConfigImpl } from './ConfigImpl';
import { DataTypeEnum } from './Resource/DataTypeEnum';

/****************************************************************************
 名称：默认 配置参数

 最后修改日期：2023-08-14
 ****************************************************************************/
const DefaultConfig: ConfigImpl = {
    Version: '2023.09.28',
    Token: '',
    appName: 'VGEEarth WebGL平台',
    appTitle: 'VGEEarth',
    appIcon: require('../../../img/icon.png'),
    homeView: {longitude: 110, latitude: 40, height: 20000000},
    startAnimation: false,
    GISResourcesUrl: '',
    demoServerUrl: 'http://localhost:3008/',
    AppBaseUrl: '',
    layerList: [
        {
            pid: '8765c4e9-0e21-1cb9-4f3f-1852c9a67208',
            name: '全球影像底图',
            catalog: '基础影像',
            dataType: DataTypeEnum.layer,
            showInTree: false,
            defaultLoad: true,
            offlineCache: false,
            properties: {
                baseLayer: true,
                scheme: 'layer-singleTileImagery',
                tileWidth: 2048,
                tileHeight: 1024
            }
        }
    ],
    terrainList: [],
    modelList: [],
    cesium3DTileSetList: [],
    geoJsonList: [],
    poiList: []
};

export { DefaultConfig };
