VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.loadConfig({ homeView: { longitude: 110, latitude: 30, height: 1000000 } });

const earth = new VGEEarth.Earth('MapContainer');
earth.openOLMapLink23d();
