/**
 * 坐标类型的枚举
 *
 * 可赋值给坐标采集工具，以获取对应的坐标类型
 */

enum CoordinateType {
    cartesian3 = 'cartesian3',
    cartographicObj = 'cartographicObj',
    cartographicPoiArr = 'cartographicPoiArr'
}

export { CoordinateType };
