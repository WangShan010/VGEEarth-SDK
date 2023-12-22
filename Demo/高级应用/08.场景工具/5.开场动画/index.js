VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

VGEEarth.ConfigTool.config.startAnimation = true;
const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();


earth.viewer3D.camera.setView({
    'destination': {
        'x': -2170874.215774269,
        'y': 6054672.811690082,
        'z': 2219411.156320076
    },
    'orientation': {
        'heading': 6.2831853071795845,
        'pitch': -1.5703429939057107,
        'roll': 0
    }
});

Cesium.RequestScheduler.requestCompletedEvent.addEventListener(function (a, b) {
    console.log('加载完成资源', Cesium.RequestScheduler.statistics.numberOfActiveRequests);
});
