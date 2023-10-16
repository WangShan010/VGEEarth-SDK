VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

VGEEarth.ConfigTool.loadConfig({ homeView: { longitude: 106.8787, latitude: 27.71544, height: 5_0000 } });

const earth = new VGEEarth.Earth('MapContainer');

let pointCluster = new VGEEarth.SuperiorEntity.PointCluster1(
    earth.viewer3D,
    './cluserPoint.json'
);

pointCluster.init();
earth.viewer3D.scene.camera.flyTo({
    'destination': {
        'x': -1642045.9016253653,
        'y': 5411841.419886313,
        'z': 2951260.9345694017
    },
    'cartographic': {
        'longitude': 106.8787,
        'latitude': 27.71544,
        'height': 5665.28352
    },
    'orientation': {
        'heading': 6.283185307179582,
        'pitch': -1.5707955025033882,
        'roll': 0
    }
});




