const config = {};

let appName = '应急指挥态势融合与调度一体化平台';
let appTitle = '应急指挥平台';
let GISResourcesUrl = 'https://emergency-rescue-webgl.oss-cn-beijing.aliyuncs.com';
let AppBaseUrl = 'http://127.0.0.1:3060';

let homeView = { longitude: 108.387, latitude: 30.71, height: 150000 };

let layerList = [];
let terrainList = [
    {
        name: '全球8级地形',
        catalog: '地形图层',
        dataType: 'terrain',
        properties: {
            scheme: 'CesiumTerrainProvider',
            url: 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/DEM-wordHeights'
        }
    }
];
let poiList = [
    {
        name: '胡家岭灾害点',
        catalog: '三维标注',
        defaultLoad: true,
        dataType: 'poi',
        properties: {
            position: { longitude: 108.40, latitude: 30.661 },
            text_string: '胡家岭灾害点',
            image_path: GISResourcesUrl + '/web/marker/marker.png'
        }
    },
    {
        name: '哈高院子灾害点',
        catalog: '三维标注',
        dataType: 'poi',
        defaultLoad: true,
        properties: {
            position: { longitude: 108.353753, latitude: 30.583756 },
            text_string: '哈高院子灾害点',
            image_path: GISResourcesUrl + '/web/marker/marker.png'
        }
    },
    {
        name: '仙鹤村隐患点',
        catalog: '三维标注',
        dataType: 'poi',
        defaultLoad: true,
        properties: {
            position: {
                longitude: 108.534681165104, latitude: 30.8685896188914
            }, text_string: '仙鹤村隐患点', image_path: GISResourcesUrl + '/web/marker/危险信号.png'
        }
    },
    {
        name: '芹菜田隐患点',
        catalog: '三维标注',
        dataType: 'poi',
        defaultLoad: true,
        properties: {
            position: {
                longitude: 108.536391073351, latitude: 30.8690107257067
            }, text_string: '芹菜田隐患点', image_path: GISResourcesUrl + '/web/marker/marker.png'
        }
    },
    {
        name: '哈高院子滑坡后壁',
        catalog: '三维标注',
        dataType: 'poi',
        defaultLoad: false,
        properties: {
            position: { longitude: 108.353712, latitude: 30.583529 },
            text_string: '后壁',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    },
    {
        name: '哈高院子滑坡体',
        catalog: '三维标注',
        dataType: 'poi', defaultLoad: false, properties: {
            position: { longitude: 108.353736, latitude: 30.583868 },
            text_string: '坡体',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    },
    {
        name: '哈高院子滑坡脚',
        catalog: '三维标注',
        dataType: 'poi', defaultLoad: false, properties: {
            position: { longitude: 108.353667, latitude: 30.584143 },
            text_string: '坡脚',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    },
    {
        name: '胡家岭滑坡后壁',
        catalog: '三维标注',
        dataType: 'poi', defaultLoad: false, properties: {
            position: { longitude: 108.403782, latitude: 30.668099 },
            text_string: '后壁',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    },
    {
        name: '胡家岭滑坡体',
        catalog: '三维标注',
        dataType: 'poi', defaultLoad: false, properties: {
            position: { longitude: 108.402946, latitude: 30.66913 },
            text_string: '坡体',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    },
    {
        name: '胡家岭滑坡脚',
        catalog: '三维标注',
        dataType: 'poi', defaultLoad: false, properties: {
            position: { longitude: 108.401984, latitude: 30.669868 },
            text_string: '坡脚',
            image_path: GISResourcesUrl + '/web/marker/placemark.png'
        }
    }
];
let modelList = [];
let cesium3DTileSetList = [
    // 点云数据
    {
        name: '大雁塔倾斜模型',
        catalog: '三维模型',
        dataType: 'Cesium3DTile',
        properties: {
            url: 'https://vge-webgl-open.oss-cn-beijing.aliyuncs.com/3DTiles-DaYanTa/tileset.json',
            offset: {
                height: 440
            }
        }
    }
];
let geoJsonList = [{
    pid: '334f021a-4059-1e83-e7e2-8b3bc16b7481',
    name: '滑坡区域',
    catalog: '灾害',
    dataType: 'geoJson',

    defaultLoad: false,
    properties: {
        label: {
            text: '二次滑坡堆积物',
            pixelOffset: { x: 0, y: 0 }
        },
        url: './滑坡区域.geojson'
    }
}];

config.GISResourcesUrl = GISResourcesUrl;   // GIS资源路径
config.AppBaseUrl = AppBaseUrl;             // 项目主后台服务基本路径

config.appName = appName;                   // 完整项目名
config.appTitle = appTitle;                 // 项目简名 用于加载在标签栏上
config.homeView = homeView;
config.layerList = layerList;
config.terrainList = terrainList;
config.poiList = poiList;
config.cesium3DTileSetList = cesium3DTileSetList;
config.geoJsonList = geoJsonList;

VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);
VGEEarth.ConfigTool.loadConfig(config);


const earth = new VGEEarth.Earth('MapContainer');

let zTreeMana = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D, VGEEarth.ScopeType.Viewer3D, { font: { 'color': 'white' } });

