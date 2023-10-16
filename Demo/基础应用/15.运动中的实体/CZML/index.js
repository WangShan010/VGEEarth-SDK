const earth = new VGEEarth.Earth('MapContainer');
earth.createNavigation();
earth.openDeBug();

const czml = [
    {
        'id': 'document',
        'version': '1.0'
    },
    {
        'id': 'Vehicle',
        availability: '2012-08-04T10:00:00Z/2012-08-04T20:00:00Z',
        'model': {
            'gltf': './models/CesiumMilkTruck.glb',
            'minimumPixelSize': 100,
            'maximumScale': 50
        },
        'orientation': {
            'velocityReference': '#position'
        },
        'viewFrom': {
            'cartesian': [-2080, -1715, 779]
        },
        'path': {
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [
                            255, 255, 0, 255
                        ]
                    }
                }
            },
            'width': [
                {
                    'number': 5.0
                }
            ],
            'show': [
                {
                    'boolean': true
                }
            ]
        },
        'position': {
            'interpolationAlgorithm': 'LAGRANGE',
            'interpolationDegree': 1,
            epoch: '2012-08-04T10:00:00Z',
            'cartographicDegrees': [
                '2012-08-04T10:00:00Z',
                115.26476337045382,
                40.56191900422532,
                748.0428250229103,
                '2012-08-04T10:00:00Z',
                115.56009366760802,
                39.89022087439962,
                674.0216341234318,
                '2012-08-04T12:11:19Z',
                115.83159653999022,
                39.918647695401475,
                756.072875426103,
                '2012-08-04T12:50:17Z',
                115.97562643455605,
                40.43450295176227,
                491.6559070035308,
                '2012-08-04T14:28:03Z',
                115.68798997438047,
                40.59075552970854,
                1356.2052113971736,
                '2012-08-04T15:17:52Z',
                115.55337439064931,
                40.38468374873095,
                528.7704690202806,
                '2012-08-04T16:00:31Z',
                115.61799513911352,
                40.16128462663794,
                660.7031769318602
            ]
        }
    }
];


earth.viewer3D.dataSources
    .add(Cesium.CzmlDataSource.load(czml))
    .then(function (ds) {
        earth.viewer3D.trackedEntity = ds.entities.getById('Vehicle');
    });

