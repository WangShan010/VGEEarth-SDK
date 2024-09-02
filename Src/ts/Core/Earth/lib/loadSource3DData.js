/**
 * 默认 3D Viewer 配置参数
 *
 * @packageDocumentation
 */
import { ConfigTool } from '../../Config/ConfigTool';
import { AsyncTool } from '../../../Utils/YaoDo/Source/AsyncTool';
async function loadSource3DData(viewer3D, workSpace) {
    viewer3D.imageryLayers.removeAll();
    viewer3D.scene.skyAtmosphere.show = false;
    viewer3D.scene.globe.show = false;
    // 加载地球的初始默认地形
    const baseTerrainItem = ConfigTool.getBaseTerrain();
    let baseTerrainPromise = null;
    if (baseTerrainItem) {
        baseTerrainPromise = AsyncTool.awaitWrap(workSpace.addData(baseTerrainItem));
    }
    // 加载地球的基础地图图层
    const baseLayerItem = ConfigTool.getBaseLayer();
    let baseLayerPromise = null;
    if (baseLayerItem) {
        baseLayerPromise = AsyncTool.awaitWrap(workSpace.addData(baseLayerItem));
    }
    await Promise.all([baseTerrainPromise, baseLayerPromise]);
    viewer3D.scene.skyAtmosphere.show = true;
    viewer3D.scene.globe.show = true;
    const allSources = ConfigTool.getAllSources();
    for (let i = 0; i < allSources.length; i++) {
        let item = allSources[i];
        // 优先加载影像图层
        if (item.defaultLoad && item.dataType === 'layer') {
            if (baseLayerItem && item.pid === baseLayerItem.pid) {
                continue;
            }
            await AsyncTool.awaitWrap(workSpace.addData(item));
        }
    }
    for (let i = 0; i < allSources.length; i++) {
        let item = allSources[i];
        // 其次再加载非影像资源
        if (item.defaultLoad && item.dataType !== 'layer') {
            if (baseTerrainItem && item.pid === baseTerrainItem.pid) {
                // 如果该地形已经预加载过了，就不再加载了
                continue;
            }
            // 三维地图加载资源
            await AsyncTool.awaitWrap(workSpace.addData(item));
        }
    }
}
export { loadSource3DData };
