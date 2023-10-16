/**
 * 名称：默认 2D Viewer 配置参数
 *
 * @packageDocumentation
 */

import { Viewer } from 'cesium';
import { WorkSpace } from '../../WorkSpace/index';
import { ConfigTool } from '../../Config/ConfigTool';
import { AsyncTool } from '../../../Utils/YaoDo/Source/AsyncTool';


async function loadSource2DData(viewer2D: Viewer, workSpace: WorkSpace) {
    viewer2D.imageryLayers.removeAll();

    // 先加载地球的底图
    let l = ConfigTool.getBaseLayer();
    l && await AsyncTool.awaitWrap(workSpace.addData(l));

    viewer2D.scene.skyAtmosphere.show = true;
    viewer2D.scene.globe.show = true;

    // 加载其他图层
    for (let i = 0; i < ConfigTool.getAllSources().length; i++) {
        let item = ConfigTool.getAllSources()[i];
        if (item.defaultLoad && item.dataType === 'layer') {
            if (l && item.pid === l.pid) {
                continue;
            }
            await AsyncTool.awaitWrap(workSpace.addData(item));
        }
    }
}


export { loadSource2DData };
