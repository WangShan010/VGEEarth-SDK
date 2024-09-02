VGEEarth.ConfigTool.addTerrainOnAliYun(true);
VGEEarth.ConfigTool.addBingMapOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

const globeRotate = new VGEEarth.GlobalRotation(earth.viewer3D);

globeRotate.rotateInit();
globeRotate.startRote();
