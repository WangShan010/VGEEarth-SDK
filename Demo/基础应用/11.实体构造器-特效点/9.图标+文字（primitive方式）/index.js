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
let point = new VGEEarth.SuperiorEntity.PrimitiveLabelCol(earth.viewer3D);
fetch('./css/mudi-all.json ')
    .then(res => res.json())
    .then(res => {
        res.data.forEach(item => {
            const position = Cesium.Cartesian3.fromDegrees(Number(item.lng), Number(item.lat));
            const label = item.text;
            point._add(position, label, './css/mark3.png');
        });
    });


