const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.viewer3D.scene.globe.depthTestAgainstTerrain = false;

let options = {
    backGround: 'static/beij.083ca80f.png', //周围行政区背景图
    wallgradients: 'static/wallgradients.png', //行政区边界墙体效果
    size: 0.5, //标签大小
    colorLine: [.10, .10, .10], //周围行政区别界线颜色
    colorPolygon: [.10, .15, .15] //周围行政区边境面颜色
};
let promiseFetch = [
    fetch('./static/region.json'),
    fetch('./static/CHN_adm2.json')
];
let regionJson = await Promise.all(promiseFetch)
    .then(res => {
        return res.map(x => x.json());
    })
    .then(async res => {
        const x = await Promise.all(res);
        return x.map(res => res.features);
    });
let regionLabel = new VGEEarth.RegionLabel(
    earth.viewer3D, options, regionJson
);


// fetch("./static/region.json").then(res => {
//     return res.json()
// }).then(res => {
//     let features = res.features
//     let regionLabel = new VGEEarth.RegionLabel(
//         earth.viewer3D, options,features
//     )
//     regionLabel.addPeripheryRegion();
// })

earth.viewer3D.scene.camera.setView({
    destination: {
        x: -3036049.2049679733,
        y: 6765587.416918585,
        z: 3452995.864224429
    },
    orientation: {
        heading: 5.889445354861434,
        pitch: -1.2687745954690257,
        roll: 0.00023910045793762436
    },
    duration: 2
});
