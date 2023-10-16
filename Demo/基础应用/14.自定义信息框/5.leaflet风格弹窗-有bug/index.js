VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);


let options = { infoBox: false };
const earth = new VGEEarth.Earth('MapContainer', true, options);
earth.createNavigation();
earth.openDeBug();
//开启深度检测
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;

//窗口显示变量
let window = undefined;
//属性遍历变量
let lastPickFature = undefined;
let lastPickColor = undefined;

initEvent();
load3dtiles();


//加载3dtiles数据
function load3dtiles() {
    var tileset = earth.viewer3D.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: 'http://211.149.185.229:8081/data/3dtiles/gongchang/tileset.json'
        })
    );
    earth.viewer3D.flyTo(tileset)
}

function initEvent() {
    let handler = new Cesium.ScreenSpaceEventHandler(earth.viewer3D.scene.canvas);
    handler.setInputAction((evt) => {
        console.log('事件触发');
        closeWindow();
        let pFeature = earth.viewer3D.scene.pick(evt.position);
        if (!pFeature) return;
        let position = earth.viewer3D.scene.pickPosition(evt.position);
        if (lastPickFature) {
            lastPickFature.color = lastPickColor;
        }
        if (pFeature instanceof Cesium.Cesium3DTileFeature) {
            lastPickFature = pFeature;
            lastPickColor = pFeature.color.clone();
            pFeature.color = Cesium.Color.YELLOW;
        }

        let propertyNames = pFeature.getPropertyNames(); //模型所有属性信息
        let values = [];
        let fields = [];
        for (let i = 0; i < propertyNames.length; i++) {
            const item = propertyNames[i];
            fields.push(item);
            values.push(pFeature.getProperty(item));
        }

        //手动加一个字段
        fields.push('height');
        values.push(0);

        showWindow(position, fields, values);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

//显示窗口
function showWindow(position, fields, values) {
    console.log('显示窗口');
    window = new VGEEarth.SuperiorEntity.LeafletPopup(earth.viewer3D, position, fields, values);
}

//关闭窗口
function closeWindow() {

    if (window) {
        console.log('运行到if语句');
        window.close();
        window = undefined;
    }
}


function destroy() {
    if (window) {
        window.close();
        window = undefined;
    }
    earth.viewer3D.entities.removeAll();
    earth.viewer3D.imageryLayers.removeAll(true);
    earth.viewer3D.destroy();
};
