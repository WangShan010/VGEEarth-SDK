VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
let position = Cesium.Cartesian3.fromDegrees(108.42533733304246, 34, 2000);
earth.viewer3D.scene.camera.setView({destination: position});

let options = {
    radius: 3000,
    debugExtent: true
};

let cameraLimit = new VGEEarth.CameraLimit(
    earth.viewer3D,
    position,
    options
);

cameraLimit.initLimit();
