VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();


const host = 'https://vge-webgl.oss-cn-beijing.aliyuncs.com/encrypt/3DTiles-TianYi/';
const passWorld = '795bc22d-c487-6fd6-ec77-56849171d53d';

CesiumNetworkPlug.OfflineCacheController.ruleList.add('*');
CesiumNetworkPlug.DecryptionController.ruleMap.set(`${host}`, passWorld);
let s = {
    pid: '1234567890',
    name: '倾斜模型',
    catalog: '三维模型',
    dataType: 'Cesium3DTile',
    defaultLoad: true,
    properties: {
        url: host + 'tileset.json',
        maximumScreenSpaceError: 2,
        maximumMemoryUsage: 8192,
        offset: {
            height: 25
        }
    }
};

earth.viewer3D.camera.setView({
    'destination': {
        'x': -2500224.435180844,
        'y': 4810553.614376217,
        'z': 3348837.625345828
    },
    'cartographic': {
        'longitude': 117.46258,
        'latitude': 31.87582,
        'height': 173.21535
    },
    'orientation': {
        'heading': 6.21808781201733,
        'pitch': -0.7479841864133672,
        'roll': 0.000003847567505488314
    }
});

let ds = earth.viewer3DWorkSpace.addData(s).then(() => {
    earth.viewer3DWorkSpace.flyToDataByPid(s.pid);
});




