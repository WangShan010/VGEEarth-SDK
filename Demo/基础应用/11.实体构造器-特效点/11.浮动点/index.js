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
let point = new VGEEarth.SuperiorEntity.FloatMarker(
    earth.viewer3D,
    {
        longitude: 108.4,
        latitude: 30.728
    }
);

point.init();

// earth.viewer3D.zoomTo(point.floatMarker)


earth.viewer3D.scene.camera.setView(
    {
        'destination': {
            'x': -1732309.019553604,
            'y': 5207244.882607349,
            'z': 3240250.9810304176
        },
        'cartographic': {
            'longitude': 108.40088,
            'latitude': 30.72817,
            'height': 442.37088
        },
        'orientation': {
            'heading': 4.459886891211935,
            'pitch': -0.22935210834443454,
            'roll': 0.0000013874861979346065
        }
    }
);
