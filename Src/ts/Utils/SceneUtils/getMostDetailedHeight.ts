// 取从地球上对点的高程进行采样，如果这个点位没有 3DTiles 或 模型，则取地形高
import { WorldDegree } from '../../Core/Impl/Declare';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';
import { Cartesian3Tool } from '../CoordinateTool/Cartesian3Tool';
import { CartographicTool } from '../CoordinateTool/CartographicTool';
import { Cartesian3 } from 'cesium';
import { getTerrainMostDetailedHeight } from './getTerrainMostDetailedHeight';

async function getMostDetailedHeight(positions: WorldDegree[]) {
    positions = JSON.parse(JSON.stringify(positions));

    const viewer = getMainViewer();

    // 获取模型高度
    const inModelList = await viewer.scene.clampToHeightMostDetailed(Cartesian3Tool.formCartographicObjS(positions));

    const inModelHeightList = inModelList.filter((c: Cartesian3) => c).map((c: Cartesian3) => CartographicTool.formCartesian3(c)) || [];

    // 获取地形高度
    let inTerrainList = [];
    if (inModelHeightList.length === 0) {
        for (let i = 0; i < positions.length; i++) {
            inTerrainList.push({
                longitude: positions[i].longitude,
                latitude: positions[i].latitude,
                height: await getTerrainMostDetailedHeight(positions[i].longitude, positions[i].latitude)
            });
        }
    }

    for (let i = 0; i < positions.length; i++) {
        // 如果模型高度存在，则取模型高度
        if (inModelHeightList[i]?.height) {
            positions[i].height = inModelHeightList[i].height;
            // console.log('模型高度', inModelHeightList[i].height);
        }
        // 如果模型高度不存，则取地形高度
        else if (inTerrainList[i]?.height) {
            positions[i].height = inTerrainList[i].height;
            // console.log('地形高度', inTerrainList[i].height);
        }
        // 如果地形高度不存在，则取 0
        else {
            positions[i].height = 0;
        }
    }
    return positions;
}


export { getMostDetailedHeight };
