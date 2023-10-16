VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

VGEEarth.ConfigTool.loadConfig({ homeView: { longitude: 108.95850065559718, latitude: 34.21944714452281, height: 800 } });

const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;
earth.createNavigation();
earth.openDeBug();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;

let bMarkers = [];
addBounceMarkers();
initEvent();

//初始化事件
function initEvent() {
    new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction(e => {
        let pickId = viewer.scene.pick(e.position);
        if (pickId && pickId.id && pickId.id.bounce) {
            pickId.id.bounce();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


//初始化BounceMarker
function addBounceMarkers() {
    bMarkers = [];
    let position = Cesium.Cartesian3.fromDegrees(108.95850065559718, 34.21944714452281, -1);
    let bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position);
    bMarkers.push(bMarker);

    position = Cesium.Cartesian3.fromDegrees(108.95909494633781, 34.219537169430744, -2);
    bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position);
    bMarkers.push(bMarker);

    position = Cesium.Cartesian3.fromDegrees(108.95966728565314, 34.219028011091496, -3);
    bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position);
    bMarkers.push(bMarker);

    position = Cesium.Cartesian3.fromDegrees(108.95941801151338, 34.21876373222085, -4);
    bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position);
    bMarkers.push(bMarker);

    position = Cesium.Cartesian3.fromDegrees(108.95976447924141, 34.219705361971975, -2);
    bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position);
    bMarkers.push(bMarker);

    position = Cesium.Cartesian3.fromDegrees(108.9604459582188, 34.219064731198834, -4);
    bMarker = new VGEEarth.NormalEntity.bouncePoint(viewer, position, {
        //image: "static/images/marker/mark3.png",
        bounceHeight: 100, //高度
        increment: 0.05 //增量
    });
    bMarkers.push(bMarker);
}

//重新加载
function reload() {
    bMarkers.forEach(item => {
        item.remove();
    });
    addBounceMarkers();
}


function destroy() {
    viewer.entities.removeAll();
    viewer.imageryLayers.removeAll(true);
    viewer.destroy();
}
