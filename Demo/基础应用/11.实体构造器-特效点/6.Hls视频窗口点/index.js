VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

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


const earth = new VGEEarth.Earth('MapContainer', { infoBox: false });
earth.createNavigation();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let monitor = {
    id: '51616161',
    name: 'Hls监控1',
    url: 'http://220.161.87.62:8800/hls/0/index.m3u8',
    position: {
        longitude: 108.97697,
        latitude: 32.05784
    }
};


let hls = new VGEEarth.SuperiorEntity.HlsVideoWindow(earth.viewer3D, monitor);
hls.init();
