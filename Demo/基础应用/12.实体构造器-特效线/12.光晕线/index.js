VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

let line = VGEEarth.Material.Polyline.GlowLine('./chendu-daolu.json');
earth.viewer3D.dataSources.add(line);

earth.viewer3D.scene.camera.setView({
    duration: 1,
    destination: {
        x: -1337790.7881094853,
        y: 5330396.094162445,
        z: 3231621.5380446212
    },
    orientation: {
        heading: 6.010538181825211,
        pitch: -0.6819480997380261,
        roll: 6.282163306739159
    }
});
