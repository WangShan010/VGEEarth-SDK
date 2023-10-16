import { Cesium } from '../../Core/Impl/Declare';
import { getEarth } from '../../Core/Earth/lib/getEarth';
import { getMainViewer } from '../../Core/Earth/lib/getMainViewer';

// 获取地形最精确的高程，地形数据源链接可能有些数据残缺，所以需要判断
async function getTerrainMostDetailedHeight(longitude: number, latitude: number) {

    await getEarth()?.thenLoadComplete();

    // 地形为空（标准椭球）
    if (!getMainViewer().terrainProvider.availability) {
        console.log('地形为空（标准椭球）');
        return 0;
    }

    let terrainProvider = getMainViewer().terrainProvider;
    let updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, [
        Cesium.Cartographic.fromDegrees(longitude, latitude)
    ]);

    return updatedPositions[0]?.height || 0;
}

export { getTerrainMostDetailedHeight };