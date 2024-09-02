const earth = new VGEEarth.Earth('MapContainer');
VGEEarth.ConfigTool.addBingMapOnAliYun(true);
VGEEarth.ConfigTool.addTerrainOnAliYun(true);

let t = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);

