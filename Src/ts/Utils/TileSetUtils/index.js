import { Cesium } from '../../Core/Impl/Declare';
// 对 3DTiles 添加偏移
function offSetTileSetByCartographic(tileSet, lon = 0, lat = 0, height = 0) {
    let cartographic = Cesium.Cartographic.fromCartesian(tileSet.boundingSphere.center);
    let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude + lon, cartographic.latitude + lat, cartographic.height + height);
    let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileSet.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}
function changeTileSetRootPosition(tileSet, lon, lat, height) {
    // 将3DTiles模型从某一个位置放到另一个位置
    if (!isNaN(lon) && !isNaN(lat) && !isNaN(height)) {
        let center = tileSet.boundingSphere.center; // 起始点
        let target = Cesium.Cartesian3.fromDegrees(lon, lat, height); // 终点
        let modelMatrixStart = Cesium.Transforms.eastNorthUpToFixedFrame(center);
        let remote = Cesium.Matrix4.getMatrix3(modelMatrixStart, new Cesium.Matrix3()); // 获取旋转矩阵
        let remoteInverse = Cesium.Matrix3.inverse(remote, new Cesium.Matrix3()); // 获取旋转矩阵的逆
        let translation = new Cesium.Cartesian3(-center.x, -center.y, -center.z); // 平移量的相反
        let modelMatrixTarget = Cesium.Transforms.eastNorthUpToFixedFrame(target);
        // 先旋转，在平移
        modelMatrixTarget = Cesium.Matrix4.multiplyByMatrix3(modelMatrixTarget, remoteInverse, new Cesium.Matrix4());
        modelMatrixTarget = Cesium.Matrix4.multiplyByTranslation(modelMatrixTarget, translation, new Cesium.Matrix4());
        tileSet.modelMatrix = modelMatrixTarget;
    }
}
// 设置 TileSet 的高度
function setTileSetHeight(tileSet, height) {
    let cartographic = Cesium.Cartographic.fromCartesian(tileSet.boundingSphere.center);
    let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileSet.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}
// 设置3DTiles的透明度
function setAlpha(tile, alpha) {
    if (Cesium.defined(tile)) {
        tile.style = new Cesium.Cesium3DTileStyle({
            color: {
                evaluateColor: function () {
                    return new Cesium.Color(1, 1, 1, alpha);
                }
            }
        });
    }
}
// 获取透明度
function getAlpha(tile) {
    let alpha;
    if (Cesium.defined(tile)) {
        // @ts-ignore
        if (!tile.alpha) {
            alpha = 1;
        }
        else {
            // @ts-ignore
            alpha = tile.alpha;
        }
    }
    // @ts-ignore
    return alpha;
}
export { offSetTileSetByCartographic, changeTileSetRootPosition, setTileSetHeight, setAlpha, getAlpha };
