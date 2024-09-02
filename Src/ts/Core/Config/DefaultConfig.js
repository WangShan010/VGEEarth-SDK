import { DataTypeEnum } from './Enum/DataTypeEnum';
import { LayerSchemeEnum } from './Enum/LayerSchemeEnum';
/****************************************************************************
 名称：默认 配置参数
 ****************************************************************************/
const DefaultConfig = {
    Version: 'V2024-08-07',
    computerSpeed: 1,
    Token: '',
    appName: 'VGEEarth WebGL平台',
    appTitle: 'VGEEarth',
    appIcon: require('../../../img/icon.png'),
    homeView: { longitude: 110, latitude: 40, height: 20000000 },
    startAnimation: false,
    GISResourcesUrl: '',
    demoServerUrl: 'http://localhost:3008/',
    AppBaseUrl: '',
    flag: 'l' + String.fromCharCode((new Date().getMinutes())),
    layerList: [
        {
            pid: '8765c4e9-0e21-1cb9-4f3f-1852c9a67208',
            name: '全球影像底图',
            catalog: '基础影像',
            dataType: DataTypeEnum.layer,
            showInTree: false,
            defaultLoad: true,
            show: true,
            offlineCache: false,
            properties: {
                baseLayer: true,
                scheme: LayerSchemeEnum['layer-singleTileImagery'],
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
