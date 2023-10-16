/**
 * 默认 3D Viewer 配置参数
 *
 * @packageDocumentation
 */

import { Viewer } from 'cesium';
import { WorkSpace } from '../../WorkSpace/index';
import { ConfigTool } from '../../Config/ConfigTool';
import { AsyncTool } from '../../../Utils/YaoDo/Source/AsyncTool';

async function loadSource3DData(viewer3D: Viewer, workSpace: WorkSpace) {
    viewer3D.imageryLayers.removeAll();

    // 加载地球的基础图层
    let l = ConfigTool.getBaseLayer();
    l && await AsyncTool.awaitWrap(workSpace.addData(l));

    // 加载地球的基础地形
    let t = ConfigTool.getBaseTerrain();
    if (t && !workSpace.getNodeByPid(t.pid)) {
        await AsyncTool.awaitWrap(workSpace.addData(t));
    }

    viewer3D.scene.skyAtmosphere.show = true;
    viewer3D.scene.globe.show = true;

    for (let i = 0; i < ConfigTool.getAllSources().length; i++) {
        let item = ConfigTool.getAllSources()[i];
        // 优先加载影像图层
        if (item.defaultLoad && item.dataType === 'layer') {
            if (l && item.pid === l.pid) {
                continue;
            }
            await AsyncTool.awaitWrap(workSpace.addData(item));
        }
    }

    for (let i = 0; i < ConfigTool.getAllSources().length; i++) {
        let item = ConfigTool.getAllSources()[i];
        // 其次再加载非影像资源
        if (!workSpace.getNodeByPid(item.pid) && item.defaultLoad && item.dataType !== 'layer') {
            // 三维地图加载资源
            await AsyncTool.awaitWrap(workSpace.addData(item));
        }
    }
}

export { loadSource3DData };
