VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

const globeRotate = new VGEEarth.GlobalRotation(earth.viewer3D);

globeRotate.rotateInit();
globeRotate.startRote();
