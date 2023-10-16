VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

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

window.startAnimation = new VGEEarth.StartAnimation(earth.viewer3D);

startAnimation.activate();
