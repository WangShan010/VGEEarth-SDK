// 取从地球上对点的高程进行采样，如果这个点位没有 3DTiles 或 模型，则取地形高
import { Cesium, WorldDegree } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
import { Cartographic } from 'cesium';

async function getMostDetailedHeight(positions: WorldDegree[]) {
    positions = JSON.parse(JSON.stringify(positions));

    const viewer = getMainViewer();
    let cartographicList: Cartographic[] = positions.map(WorldDegree => {
        return Cesium.Cartographic.fromDegrees(WorldDegree.longitude, WorldDegree.latitude);
    });
    let inModelHeightList = await viewer.scene.sampleHeightMostDetailed(cartographicList);
    let inTerrainList = [];
    if (viewer.terrainProvider.availability) {
        inTerrainList = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, cartographicList);
    } else {
        console.log('当前区域不存在地形');
    }

    for (let i = 0; i < inModelHeightList.length; i++) {
        if (inModelHeightList[i].height !== 0 && inModelHeightList[i].height > -500) {
            positions[i].height = inModelHeightList[i].height;
        } else if (inTerrainList[i] && inTerrainList[i].height) {
            positions[i].height = inTerrainList[i].height;
        } else {
            positions[i].height = 0;
        }
    }
    return positions;
}


export { getMostDetailedHeight };