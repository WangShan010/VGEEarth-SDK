const config = {};

let appName = '应急指挥态势融合与调度一体化平台';
let appTitle = '应急指挥平台';
let GISResourcesUrl = 'https://emergency-rescue-webgl.oss-cn-beijing.aliyuncs.com';
let AppBaseUrl = 'http://127.0.0.1:3060';
let homeView = { longitude: 108.387, latitude: 30.71, height: 150000 };

let layerList = [
    {
        name: '高德影像',
        catalog: '基础数据',
        dataType: 'layer',
        defaultLoad: true,
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
        }
    },
    {
        name: '高德电子地图',
        catalog: '基础数据',
        dataType: 'layer',
        properties: {
            scheme: 'layer-xyz-3857',
            url: 'http://webst04.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'
        }
    }
];
let terrainList = [
    {
        name: '全球8级地形',
        catalog: '地形图层',
        dataType: 'terrain',
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/DEM-wordHeights'
        }
    },
    {
        name: '官网在线地形',
        catalog: '地形图层',
        dataType: 'terrain',
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'default'
        }
    }
];
let modelList = [];
let cesium3DTileSetList = [];


config.GISResourcesUrl = GISResourcesUrl;   // GIS资源路径
config.AppBaseUrl = AppBaseUrl;             // 项目主后台服务基本路径

config.appName = appName;                   // 完整项目名
config.appTitle = appTitle;                 // 项目简名 用于加载在标签栏上
config.homeView = homeView;
config.layerList = layerList;
config.terrainList = terrainList;
config.cesium3DTileSetList = cesium3DTileSetList;

VGEEarth.ConfigTool.loadConfig(config);

