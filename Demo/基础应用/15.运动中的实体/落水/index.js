VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

VGEEarth.ConfigTool.addTerrainOnIon(true);
VGEEarth.ConfigTool.addBingMapOnIon(true);

const randomLine = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            {
                'longitude': 119.66655581858427,
                'latitude': 24.575416176739964
            },
            {
                'longitude': 119.66670413520063,
                'latitude': 24.574645372502125
            },
            {
                'longitude': 119.66682396929242,
                'latitude': 24.57380138781466
            },
            {
                'longitude': 119.66663361005867,
                'latitude': 24.57280056378387
            },
            {
                'longitude': 119.66627904841116,
                'latitude': 24.571959342421522
            },
            {
                'longitude': 119.66579057023893,
                'latitude': 24.570684867276157
            },
            {
                'longitude': 119.66552187984212,
                'latitude': 24.569679317709692
            }
        ].map(item => [item.longitude, item.latitude, item.height])
    }
};

window.entity = new Cesium.Entity({
    model: {
        uri: './bell_huey_helicopter.glb',
        minimumPixelSize: 64,
        maximumScale: 20000
        // distanceDisplayCondition : new Cesium.DistanceDisplayCondition(0, 20000)
    }
});
earth.viewer3D.entities.add(entity);

VGEEarth.SceneUtils.viewerFlyToLonLat(119.66655581858427, 24.575416176739964, 1000).then(e => {

    earth.viewer3D.scene.globe.depthTestAgainstTerrain = false;
    earth.viewer3D.trackedEntity = entity;
    window.runEntityObj = new VGEEarth.RunEntityController(
        earth.viewer3D,
        entity,
        randomLine,
        50,
        false,
        true
    );

    runEntityObj.play();
    runEntityObj.playEndFunc = () => {
        console.log('playEndFunc');
        // runEntityObj.destroy();
    };


});






