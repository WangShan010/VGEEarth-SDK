VGEEarth.ConfigTool.addBingMapOnIon(true);


//初始化地球,
let options = {infoBox: false};
const earth = new VGEEarth.Earth('MapContainer', options);
earth.createNavigation();
earth.openDeBug();
//开启深度检测
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;

let window = undefined;

load3dtiles();
initMonitors();
earth.viewer3D.selectedEntityChanged.addEventListener(e => {
    selectedEntityChanged(e);
});


//初始化点位
function initMonitors() {
    let monitors = [
        {
            name: '北京西路与北京路交叉口',
            ip: '42.23.33.23',
            type: '固定枪机',
            state: '在线',
            position: {
                'x': -1715281.3495915474,
                'y': 4993364.568210457,
                'z': 3566492.378319011
            }
        },
        {
            name: '阿化修理店门口',
            ip: '42.23.33.22',
            type: '固定枪机',
            state: '在线',
            position: {
                'x': -1715474.2949957643,
                'y': 4993181.959338644,
                'z': 3566642.8219651487
            }

        },
        {
            name: '瑞安市钢材市场(东新路店)',
            ip: '42.23.33.12',
            type: '固定枪机',
            state: '在线',
            position: {
                'x': -1715421.6930113742,
                'y': 4993077.680196937,
                'z': 3566821.3299569376
            }

        }
    ];
    //遍历monitors数组，按照其中的位置信息，添加实体
    monitors.forEach(item => {
        earth.viewer3D.entities.add({
            position: item.position,
            info: item,
            billboard: {
                image: './image/bluecamera.png',
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        });
    });
};

//实体选中事件
function selectedEntityChanged(e) {
    if (!e) return;
    if (window) {
        window.close();
        window = undefined;
    }
    window = new VGEEarth.SuperiorEntity.MultiFieldAdaptWindow(earth.viewer3D, e.position._value, '监控信息', ['监控名称', 'IP地址', '监控类型', '监控状态'], [e.info.name, e.info.ip, e.info.type, e.info.state]);
}

//加载3dtiles数据
async function load3dtiles() {
    const tileSet = await Cesium.Cesium3DTileset.fromUrl('https://vge-webgl-open.oss-cn-beijing.aliyuncs.com/3DTiles-DaYanTa/tileset.json');
    earth.viewer3D.scene.primitives.add(tileSet);
    setTileSetHeight(tileSet);
    earth.viewer3D.zoomTo(tileSet);
}

//调整3dtiles的高度位置
function setTileSetHeight(tileset) {
    let cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
    );
    let surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
    );
    let offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude, 55
    );
    let translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}
