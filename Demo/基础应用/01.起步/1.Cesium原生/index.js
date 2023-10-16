Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYjVkZWE2Yi05ZjlmLTQyOTAtYjFkOC0xMmFmZTYyMjhmZGIiLCJpZCI6MjU5LCJpYXQiOjE2OTYyNjgyMzN9.iKIgzd7PueqxXsUNSIhk5C6n8uiugH-Dxy9uhOdJ5Zg';


const viewer = new Cesium.Viewer('MapContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
    })
});
