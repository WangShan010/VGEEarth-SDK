const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();
const tree = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);
