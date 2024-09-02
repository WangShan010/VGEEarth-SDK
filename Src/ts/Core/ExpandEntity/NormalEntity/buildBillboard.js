import { Cesium } from '../../Impl/Declare';
// 创建一个 Mark 标记，在地图上
function buildBillboard(lon, lat, param) {
    let option = {
        param: JSON.stringify(param),
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        billboard: {
            image: param.imgUrl,
            width: undefined,
            height: undefined,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
    };
    if (param.name)
        option.param = param.name;
    if (param.height)
        option.billboard.height = param.height;
    if (param.width)
        option.billboard.width = param.width;
    return new Cesium.Entity(option);
}
export { buildBillboard };
