VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();

earth.viewer3D.scene.globe.depthTestAgainstTerrain = false;
let regionJson = [];
let options = {
    backGround: './static/beij.083ca80f.png',      //周围行政区背景图
    wallgradients: './static/wallgradients.png',       //行政区边界墙体效果
    size: 0.5,                                   //标签大小
    colorLine: [.10, .10, .10],                               //周围行政区别界线颜色
    colorPolygon: [.10, .15, .15]                             //周围行政区边境面颜色
};
regionJson.push(fetch('./data/beijing_2.json').then(res => {
    return res.json();
}).then(res => {
    return res.features;
}));
regionJson.push(fetch('./data/beijing_3.json').then(res => {
    return res.json();
}).then(res => {
    return res.features;
}));
regionJson.push(fetch('./data/beijing_2.json').then(res => {
    return res.json();
}).then(res => {
    return res.features;
}));
let regionLabel = new VGEEarth.RegionLabel(
    earth.viewer3D, options, regionJson
);

fetch('./data/beijing_3point.json')
    .then(res => {
        return res.json();
    })
    .then(res => {
        res.features.map(feature => {
            let coordinates = feature.geometry.coordinates;
            let c = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 15010);
            new VGEEarth.SuperiorEntity.LEDLabel(earth.viewer3D, c, 3000 + Math.floor(Math.random() * 100));
        });
    });


earth.viewer3D.scene.camera.setView({
    destination: {
        x: -2285318.922205349,
        y: 4561449.436806091,
        z: 4046846.8682504706
    },
    orientation: {
        heading: 6.174723072454894,
        pitch: -0.71825433447645,
        roll: 0.0000010271026651409443
    },
    duration: 2
});
