VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);


const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

window.keyboardModel = new VGEEarth.KeyboardModelExt(
    earth.viewer3D,
    Cesium.Cartesian3.fromDegrees(118.48523, 41.38875, 1286.32155),
    {
        modelUrl: './xiaofangche.gltf',
        scale: 2,
        minimumPixelSize: 20,
        angle: 1, //转弯角度大小 越大转得越快
        speed: 0.4, //速度,
        role: 1, //0 自由视角 1 第一视角
        aotuPickHeight: true //是否拾取高度
    });
keyboardModel.activate();


