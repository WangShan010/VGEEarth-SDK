VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();
earth.viewer3D.scene.globe.terrainExaggeration = 1;

earth.viewer3D.scene.camera.flyTo({
    destination: {
        'x': -1666444.7930954625,
        'y': 5015715.430144901,
        'z': 3567788.955044996
    },
    orientation: {
        'heading': 3.1671538488176845,
        'pitch': -0.19330920034809695,
        'roll': 0.0004803805139692585
    }
});
