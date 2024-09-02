import { DataTypeEnum } from '../Enum/DataTypeEnum';
import { ResourceItem } from '../ResourceItem/ResourceItem';
import { LayerSchemeEnum } from '../Enum/LayerSchemeEnum';


//天地图申请的密钥
const TDU_Key = '';


const TianDiTuLayerList: ResourceItem[] = [
    {
        pid: '5a5fdf43-c160-c0f7-2bfa-49e6fea5b412',
        name: '矢量底图',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'vec_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/vec_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default&format=tiles&tk=' + TDU_Key
        }
    },
    {
        pid: '5019e495-328b-2adf-0988-b41b29b15718',
        name: '矢量注记',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'cva_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/cva_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default.jpg&tk=' + TDU_Key
        }
    },
    {
        pid: '5fab0a37-4a0f-cbdc-25b4-3847df3f78e5',
        name: '影像底图',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'img_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/img_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default&format=tiles&tk=' + TDU_Key
        }
    },
    {
        pid: '0dc519d9-c372-295c-3dc0-92cba440713d',
        name: '影像注记',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'cia_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/cia_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default.jpg&tk=' + TDU_Key
        }
    },
    {
        pid: '13266333-af17-3a89-2791-d63c5e4821b4',
        name: '地形晕渲',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'ter_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/ter_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/ter_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=ter&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default&format=tiles&tk=' + TDU_Key
        }
    },
    {
        pid: '2c1a6c36-582c-5358-e17b-04539c19e25b',
        name: '路网注记',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'cta_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/cta_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'http://t0.tianditu.gov.cn/cta_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=cta&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            //     '&style=default&format=tiles&tk=' + TDU_Key
        }
    },
    {
        pid: '36c78a25-4f50-476a-2535-36031977c837',
        name: '国界省界',
        catalog: '天地图',
        dataType: DataTypeEnum.layer,
        showInTree: true,
        defaultLoad: false,
        show: false,
        offlineCache: false,
        properties: {
            scheme: LayerSchemeEnum['layer-wmts'],
            layer: 'ibo_w',
            url: 'https://bj.webgpu.top:3006/mapServices/tianditu-wmts/ibo_w/{TileMatrix}/{TileCol}/{TileRow}.png'
            // url: 'https://t0.tianditu.gov.cn/ibo_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            //     '&LAYER=ibo&tileMatrixSet=w&TileMatrix=5&TileRow=15&TileCol=24' +
            //     '&style=default&format=tiles&tk=' + TDU_Key
        }
    }
];

export { TianDiTuLayerList };
