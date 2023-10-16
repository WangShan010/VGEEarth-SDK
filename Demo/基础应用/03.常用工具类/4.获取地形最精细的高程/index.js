VGEEarth.ConfigTool.addTerrainOnAliYun(true);

const earth = new VGEEarth.Earth('MapContainer');
earth.openDeBug();
earth.createNavigation();

let t = new VGEEarth.TreeMana.ZTreeMana(earth.viewer3D);

// 获取地形最精细的高程
async function getTerrainHeight() {
    let longitude = Number(document.getElementById('lon-input').value) || 102.63845496626168;
    let latitude = Number(document.getElementById('lat-input').value) || 19.341153346197157;
    let height = await VGEEarth.getTerrainMostDetailedHeight(longitude, latitude);

    alert(height);
}

window.getTerrainHeight = getTerrainHeight;
