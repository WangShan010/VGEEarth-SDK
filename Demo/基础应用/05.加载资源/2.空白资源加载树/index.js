const earth = new VGEEarth.Earth('MapContainer');
VGEEarth.ConfigTool.addBingMapOnIon(true);
VGEEarth.ConfigTool.addTerrainOnIon(true);

let t = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);

