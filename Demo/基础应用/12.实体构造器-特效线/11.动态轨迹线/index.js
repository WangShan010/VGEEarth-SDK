VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
const viewer = earth.viewer3D;

earth.openDeBug();

loadPath();

//销毁图层，需要可以添加上
//destroy();

async function loadPath() {
    fetch('./newPath.geojson').then(res => {
        return res.json();
    }).then(geoJson => {
        const maxLength = turf.length(geoJson, { units: 'meters' });
        const points = [];
        const time = new Date().getTime();
        for (let i = 0; i < maxLength; i += 100) {
            const along = turf.along(geoJson, i, { units: 'meters' });
            points.push({
                longitude: along.geometry.coordinates[0],
                latitude: along.geometry.coordinates[1],
                height: 165 + Math.floor(Math.random() * 5),
                isoTime: new Date(time + i * 10).toISOString()
            });
        }
        console.log(points);
        initPath(points);
    });
}

// todo ： 提供的无人机原始数据是一个时间序列的坐标
// 但是有个特别大的问题，这个数组的排序的错误的，如果直接
// 绘制路径，会导致非常严重的折叠遮盖问题！这个数据不可用
function sortPath(data) {
    data = data.map(item => {
        return { longitude: item.longitude + 2.250779730805789, latitude: item.latitude - 7.724177687150188, height: item.height, isoTime: item.time };
    });

    data = data.sort((a, b) => {
        return new Date(a.isoTime).getTime() - new Date(b.isoTime).getTime();
    });

    const geoJson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                'type': 'LineString',
                'coordinates': data.map(item => {
                    return [item.longitude, item.latitude, item.height];
                })
            }
        }]
    };
}

function initPath(data) {
    VGEEarth.SceneUtils.viewerFlyToLonLat(120.30873, 25.13675, 1_5000);

    //创建path对象
    let flyPath = new VGEEarth.Material.Polyline.FlyPath(viewer, data, {
        model: {
            scale: 0.1,
            minimumPixelSize: 50
        },
        label: {
            text: '搜救无人机'
        }
    });
    flyPath.addPathPoints();
}

window.drawLine = () => {
    earth.drawShape.drawPolyLine(({
        coordinateType: 'cartographicObj',
        endCallback: (e) => {
            const geoJson = {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'coordinates': [],
                    'type': 'LineString'
                }
            };

            geoJson.geometry.coordinates = e.map(item => {
                return [item.longitude, item.latitude, item.height];
            });

            const curved = turf.bezierSpline(geoJson);
            console.log(e, geoJson, curved);
        }
    }));
};
