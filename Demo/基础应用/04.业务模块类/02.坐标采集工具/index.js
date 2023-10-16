const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
window.ds = new VGEEarth.DrawShape(earth.viewer3D);
