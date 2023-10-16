VGEEarth.ConfigTool.addMapBoxOnLine(true);
VGEEarth.ConfigTool.addTerrainOnAliYun(true);

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

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let dom = document.createElement('div');
dom.innerHTML = '<div style="padding: 30px">测试div</div>';
dom.style.width = '200px';
dom.style.height = '100px';

window.point = new VGEEarth.SuperiorEntity.DivPoint(earth.viewer3D, {
    longitude: 108.97697,
    latitude: 32.05784
}, dom);

point.init();