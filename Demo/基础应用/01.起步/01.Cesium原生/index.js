const viewer = new Cesium.Viewer('MapContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
    })
});
window.viewer = viewer;
