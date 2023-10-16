VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;

earth.openDeBug();

loadPath();

//销毁图层，需要可以添加上
//destroy();

async function loadPath() {
    fetch('./多机集群.geojson').then(res => {
        return res.json();
    }).then(geoJson => {
        geoJson.features.forEach((lineGeoJson, index) => {
            const maxLength = turf.length(lineGeoJson, { units: 'meters' });
            const points = [];
            const time = new Date().getTime();
            for (let i = 0; i < maxLength; i += 1000) {
                const along = turf.along(lineGeoJson, i, { units: 'meters' });
                points.push({
                    longitude: along.geometry.coordinates[0],
                    latitude: along.geometry.coordinates[1],
                    height: 165 + Math.floor(Math.random() * 5),
                    isoTime: new Date(time + i * 10).toISOString()
                });
            }
            initPath(points);
        });
        earth.viewer3D.clock.multiplier = 100;
    });
}


let monitor = {
    title: '救援无人机',
    url: './搜索视频.mp4',
    type: 'mp4'
};


function initPath(data) {

    //创建path对象
    const flyPath = new VGEEarth.Material.Polyline.FlyPath(viewer, data, {
        model: {
            scale: 0.1,
            minimumPixelSize: 50
        },
        label: {
            text: '搜救无人机'
        }
    });
    flyPath.addPathPoints();
    flyPath.addPathBuffer();

    console.log(flyPath.pathEntity);

    const hls = new VGEEarth.SuperiorEntity.HlsVideoWindowDecorator(flyPath.pathEntity, monitor);

    hls.createDom();

    viewer.camera.setView({
        'destination': {
            'x': -2926446.1647151466,
            'y': 5003930.707094263,
            'z': 2702524.6617355943
        },
        'cartographic': {
            'longitude': 120.32035,
            'latitude': 25.14242,
            'height': 21558.71133
        },
        'orientation': {
            'heading': 6.283185307179586,
            'pitch': -1.5707947652982406,
            'roll': 0
        }
    });
}
