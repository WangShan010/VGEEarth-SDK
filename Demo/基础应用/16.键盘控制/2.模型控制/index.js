// VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);


const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;


const position = Cesium.Cartesian3.fromDegrees(116.36369419766243, 39.88334307627767, 0);
window.keyboardModel = new VGEEarth.KeyboardModel(viewer, position, {
    modelUrl: './xiaofangche.gltf',
    scale: 10,
    minimumPixelSize: 20,
    angle: 1, //转弯角度大小 越大转得越快
    speed: 1 //速度
});
keyboardModel.activate();
// this.keyboardModel.deactivate();


//设置初始视角
const flyToOpts = {
    destination: {
        x: -2177027.6063528443,
        y: 4391585.029697134,
        z: 4068112.0361764096
    },
    orientation: {
        heading: 5.600915562702169,
        pitch: -0.6594486847612337,
        roll: 6.28054486206635
    },
    duration: 1
};
viewer.scene.camera.setView(flyToOpts);
