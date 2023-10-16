/**
 * 视图同步
 *
 * @packageDocumentation
 */

import { Cesium } from '../../Impl/Declare';
import { Cartesian3, Viewer } from 'cesium';


function sync2DView(viewer3D: Viewer, viewer2D: Viewer) {
    let worldPosition: Cartesian3 | undefined;
    let distance;

    return function () {
        // 视图的中心是3D摄影机聚焦的点
        let viewCenter = new Cesium.Cartesian2(
            Math.floor(viewer3D.canvas.clientWidth / 2),
            Math.floor(viewer3D.canvas.clientHeight / 2)
        );
        // 给定中心的像素，获取世界位置
        let newWorldPosition = viewer3D.scene.camera.pickEllipsoid(viewCenter);
        if (Cesium.defined(newWorldPosition)) {
            // Guard against the case where the center of the screen
            // does not fall on a position on the globe
            worldPosition = newWorldPosition;
        }
        if (worldPosition) {
            // 获取相机聚焦点的世界位置与相机的世界位置之间的距离
            distance = Cesium.Cartesian3.distance(
                worldPosition,
                viewer3D.scene.camera.positionWC
            );
            // 告诉2D相机查看焦点。距离控制二维视图中的缩放程度
            // （尝试将下面一行中的“距离”替换为“1e7”。视图仍将同步，但将具有恒定的缩放）
            viewer2D.scene.camera.lookAt(
                worldPosition,
                new Cesium.Cartesian3(0.0, 0.0, distance)
            );
        }

    };
}

export { sync2DView };
