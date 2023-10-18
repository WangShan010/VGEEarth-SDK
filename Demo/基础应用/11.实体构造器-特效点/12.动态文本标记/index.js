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

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = true;


let span = document.createElement('span');
span.innerText = '127.0056，45.0056，1561';


let dynamicDivLabel = new VGEEarth.SuperiorEntity.DynamicDivLabel(earth.viewer3D, {
    longitude: 108.48,
    latitude: 30.72
}, span);

dynamicDivLabel.init();

earth.viewer3D.scene.camera.setView(
    {
        'destination': {
            'x': -1739822.633247056,
            'y': 5205424.311949174,
            'z': 3239717.9652153216
        },
        'cartographic': {
            'longitude': 108.4813,
            'latitude': 30.72105,
            'height': 728.5458
        },
        'orientation': {
            'heading': 3.9219294808876883,
            'pitch': -0.3229449013511061,
            'roll': 0.0000011843545379974785
        }
    }
);
