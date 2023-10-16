VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;

earth.createNavigation();
earth.openDeBug();


let keyboardCamera = new VGEEarth.KeyboardCamera(viewer);
keyboardCamera.activate();
