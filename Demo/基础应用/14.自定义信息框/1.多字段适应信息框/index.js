VGEEarth.ConfigTool.addMapBoxOnLine(true);
// VGEEarth.ConfigTool.addTerrainOnAliYun(true);

VGEEarth.ConfigTool.loadConfig({
    homeView: {
        longitude: 108.9882,
        latitude: 32.06822,
        height: 2799.40946,
        headingRadians: 3.857331164336868,
        pitchRadians: -0.418174472030965,
        rollRadians: 6.283136533129425
    }
});

//初始化地球,
let options = { infoBox: false };
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
            position: { x: -1573842.0351617213, y: 5327906.719968858, z: 3122733.541764769 }
        },
        {
            name: '阿化修理店门口',
            ip: '42.23.33.22',
            type: '固定枪机',
            state: '在线',
            position: { x: -1573743.4786981696, y: 5327995.971373521, z: 3122666.986937621 }
        },
        {
            name: '瑞安市钢材市场(东新路店)',
            ip: '42.23.33.12',
            type: '固定枪机',
            state: '在线',
            position: { x: -1573711.889710824, y: 5328072.134580926, z: 3122643.841939998 }
        },
        {
            name: '安心大药房(上旺西路店)',
            ip: '42.23.33.25',
            type: '固定枪机',
            state: '在线',
            position: { x: -1573778.4103380782, y: 5327948.310818552, z: 3122695.792699967 }
        }
    ];
    //遍历monitors数组，按照其中的位置信息，添加实体
    monitors.forEach(item => {
        earth.viewer3D.entities.add({
            position: item.position,
            info: item,
            billboard: {
                image: 'image/bluecamera.png',
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
};

//加载3dtiles数据
function load3dtiles() {
    var tileset = earth.viewer3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: 'http://211.149.185.229:8081/data/offset_3dtiles/tileset.json'
        })
    );

    tileset.readyPromise
        .then(tileset => {
            earth.viewer3D.zoomTo(
                tileset
            );
            setTileSetHeight(tileset);
        })
        .catch(error => {
            console.log(error);
        });
};

//调整3dtiles的高度位置
function setTileSetHeight(tileset) {
    var cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
    );
    var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
    );
    var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude, 55
    );
    var translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
};

function destroy() {
    earth.viewer3D.entities.removeAll();
    earth.viewer3D.imageryLayers.removeAll(true);
    earth.viewer3D.destroy();
};
