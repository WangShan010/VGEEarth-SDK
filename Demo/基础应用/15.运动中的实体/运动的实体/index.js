VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

let pinBuilder = new Cesium.PinBuilder();

let randomLine = [
    {
        'longitude': 108.96383778825628,
        'latitude': 34.2175090126237,
        'height': -0.004387256899893156
    },
    {
        'longitude': 108.96576913378911,
        'latitude': 34.21909549742705,
        'height': -0.008892744225480816
    },
    {
        'longitude': 108.96759004686838,
        'latitude': 34.21909553976091,
        'height': -0.004999948164151326
    },
    {
        'longitude': 108.96874483729412,
        'latitude': 34.21815476473891,
        'height': -0.006293877886147491
    },
    {
        'longitude': 108.96867833296663,
        'latitude': 34.21693739418476,
        'height': -0.007909490918227381
    },
    {
        'longitude': 108.96723520130007,
        'latitude': 34.21658694001748,
        'height': -0.0019751134422525515
    },
    {
        'longitude': 108.96616969676778,
        'latitude': 34.21557256406145,
        'height': -0.00733909464430064
    },
    {
        'longitude': 108.96728002709997,
        'latitude': 34.214042050304556,
        'height': -0.007553188510311935
    },
    {
        'longitude': 108.96945555435082,
        'latitude': 34.214226482672245,
        'height': -0.009022208952650048
    },
    {
        'longitude': 108.97078757289567,
        'latitude': 34.2156279638982,
        'height': -0.008772034735632758
    },
    {
        'longitude': 108.97109848674317,
        'latitude': 34.21743539834518,
        'height': -0.004698911353344197
    },
    {
        'longitude': 108.97271943059533,
        'latitude': 34.21793339634832,
        'height': -0.0029536522412697466
    },
    {
        'longitude': 108.97527266008491,
        'latitude': 34.216955738066396,
        'height': -0.0014974059042867844
    },
    {
        'longitude': 108.97482822423513,
        'latitude': 34.21557253855749,
        'height': -0.006752938862729019
    }
].map(item => {
    return {
        longitude: item.longitude,
        latitude: item.latitude,
        height: item.height + Math.random() * 500
    };
});

randomLine = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'LineString',
        'coordinates': randomLine.map(item => [item.longitude, item.latitude, item.height])
    }
};

// let randomLine = turf.randomLineString(1, {bbox: [120, 30, 120.001, 30.001], num_vertices: 80});


const position = Cesium.Cartesian3.fromDegrees(
    123.0744619,
    44.0503706,
    100
);


window.entity = new Cesium.Entity({
    position: position
});
let model = new Cesium.ModelGraphics({
    uri: './bell_huey_helicopter.glb',
    minimumPixelSize: 64,
    maximumScale: 20000
});
entity._model = model;

earth.viewer3D.entities.add(entity);

// earth.viewer3D.trackedEntity = entity;


// randomLine.features.forEach(geoLine => {
//     runEntity(earth.viewer3D.entities.add(pin), geoLine, 20, false);
// });


let s = {
    pid: '1234567890',
    name: '天一阁数据',
    catalog: '三维模型',
    dataType: 'Cesium3DTile',
    defaultLoad: true,
    properties: {
        url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
        maximumScreenSpaceError: 8,
        maximumMemoryUsage: 8192,
        offset: {
            // height: -800
        }
    }
};


let ds = earth.viewer3DWorkSpace.addData(s).then(() => {
    earth.viewer3DWorkSpace.flyToDataByPid(s.pid);

    window.runEntityObj = new VGEEarth.RunEntityController(
        earth.viewer3D,
        entity,
        randomLine,
        500,
        false,
        false
    );

    runEntityObj.play();
    runEntityObj.addPath();
    runEntityObj.playEndFunc = () => {
        console.log('playEndFunc');
        // runEntityObj.destroy();
    };
});





