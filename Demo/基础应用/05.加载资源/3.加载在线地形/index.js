VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();


VGEEarth.SceneUtils.viewerFlyToLonLat(108.42533733304246, 34, 100000);
