
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

earth.viewer3D.scene.camera.setView({
    'destination': {
        'x': -1717627.0243495503,
        'y': 4994666.006452108,
        'z': 3567177.173931772
    },
    'orientation': {
        'heading': 5.353186460111097,
        'pitch': -1.1183234118264385,
        'roll': 6.283183278745107
    }
});


window.play = function () {
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

    const position = Cesium.Cartesian3.fromDegrees(
        123.0744619,
        44.0503706,
        100
    );

    let entity = new Cesium.Entity({
        position: position
    });
    entity._model = new Cesium.ModelGraphics({
        uri: './bell_huey_helicopter.glb',
        minimumPixelSize: 64,
        maximumScale: 20000
    });

    earth.viewer3D.entities.add(entity);


    let runEntityObj = new VGEEarth.RunEntityController(
        earth.viewer3D,
        entity,
        randomLine,
        50,
        false,
        false
    );

    runEntityObj.play();
    runEntityObj.addPath();
    runEntityObj.playEndFunc = () => {
        runEntityObj.destroy();
    };
};






