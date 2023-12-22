import { Cesium } from '../../Core/Impl/Declare';
import { Cartesian3 } from 'cesium';
import { CartographicTool } from '../CoordinateTool/CartographicTool';


/**
 * 与 GIS 相关的数学函数类
 *
 * @packageDocumentation
 */

//判断笛卡尔坐标串是否为顺时针
function booleanClockwise(positions: Cartesian3[]) {
    let degreesArray: number[][] = [];
    positions.map(position => {
        degreesArray.push(cartesian3ToDegrees(position));
    });
    //首尾闭合
    degreesArray.push(degreesArray[0]);
    let lineString = window.turf.lineString(degreesArray);
    return window.turf.booleanClockwise(lineString);
}


//根据坐标串获取 ClippingPlanes 传入的坐标必须为逆时针顺序
function getClippingPlanes(positions: Array<Cartesian3>) {
    let pLength = positions.length;
    let clippingPlanes = []; // 存储ClippingPlane集合
    for (let i = 0; i < pLength; ++i) {
        let nextIndex = (i + 1) % pLength;
        let midpoint = Cesium.Cartesian3.add(positions[i], positions[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

        let up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        let right = Cesium.Cartesian3.subtract(positions[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);

        let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);

        let originCenteredPlane = new Cesium.Plane(normal, 0.0);
        let distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);
        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
    }
    return clippingPlanes;
}


//笛卡尔坐标转为经纬度
function cartesian3ToDegrees(position: Cartesian3) {
    let c = Cesium.Cartographic.fromCartesian(position);
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
}


function generateCirclePoints(center: number[], radius: number, steps: number) {
    let points = [];
    steps = steps || 360;
    let num = parseInt(String(360 / steps));
    for (let i = 0; i <= 360; i += num) {
        points.push(getCirclePoint(center[0], center[1], i, radius));
    }
    return points;
}

function getCirclePoint(lon: number, lat: number, angle: number, radius: number) {
    let dx = radius * Math.sin(angle * Math.PI / 180.0);
    let dy = radius * Math.cos(angle * Math.PI / 180.0);
    let ec = 6356725 + (6378137 - 6356725) * (90.0 - lat) / 90.0;
    let ed = ec * Math.cos(lat * Math.PI / 180);
    let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
    let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
    return [newLon, newLat];
}

function getHeight(positions: Cartesian3[]) {
    let cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
    let cartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
    let height_temp = (cartographic1.height - cartographic.height) || 0;
    return Number(height_temp.toFixed(2));
}


/**
 *判断两个点之间是否重合
 *
 * @param {*} pt1X
 * @param {*} pt1Y
 * @param {*} pt2X
 * @param {*} pt2Y
 * @param {*} delta
 */
function TwoPointsOverlay(pt1X: number, pt1Y: number, pt2X: number, pt2Y: number, delta: number) {
    return Math.abs(pt1X - pt2X) < delta && Math.abs(pt1Y - pt2Y) < delta;
}

function CheckLonDegree(value: number) {
    return !(value > 180 || value < -180);

}

function CheckLonRadian(value: number) {
    return !(value > Math.PI || value < -Math.PI);

}

function CheckLatDegree(value: number) {
    return !(value > 90 || value < -90);

}

function CheckLatRadian(value: number) {
    return !(value > Math.PI / 2.0 || value < -Math.PI / 2.0);

}


const GISMathUtils = {


    //插值间隔 单位度
    DeltaDegree: 0.00001,
    DeltaRadian: 0.00001 * Math.PI / 180.0,


    /**
     * 纬度转米
     * @param diff  纬度值
     */
    lat_to_meter: (diff: number) => diff / 0.000000157891,
    lon_to_meter: (diff: number, lat: number) => diff / 0.000000156785 * Math.cos(lat),
    meter_to_lat: (m: number) => m * 0.000000157891,
    meter_to_long: (m: number, lat: number) => m * 0.000000156785 / Math.cos(lat),


    /**
     * 获得点在直线上的垂点，垂足, -1在方向延迟线，0在区间内，1在正向延长线
     * @param ptX
     * @param ptY
     * @param L1X
     * @param L1Y
     * @param L2X
     * @param L2Y
     * @param result
     */
    pointProjectLine: function (ptX: number, ptY: number, L1X: number, L1Y: number, L2X: number, L2Y: number, result: number[]) {
        if (TwoPointsOverlay(L1X, L1Y, L2X, L2Y, 0.0000001)) {
            result[0] = L1X;
            result[1] = L1Y;
            return 0;
        }
        if (TwoPointsOverlay(L1X, L1Y, ptX, ptY, 0.0000001) ||
            TwoPointsOverlay(L2X, L2Y, ptX, ptY, 0.0000001)) {
            result[0] = ptX;
            result[1] = ptY;
            return 0;
        }

        let dis1 = //直线起点到点的位置
            this.TwoPointsDistance(L1X, L1Y, ptX, ptY);
        let angle0 = //直线的矢量
            this.vecAngle(L1X, L1Y, L2X, L2Y);
        let dis0 = //直线的距离
            this.TwoPointsDistance(L1X, L1Y, L2X, L2Y);
        let angle1 = //直线起点到点的矢量
            this.vecAngle(L1X, L1Y, ptX, ptY);
        let deltaAngle = angle0 - angle1;

        let dis2 = //投影距离
            Math.cos(deltaAngle) * dis1;
        result[0] = L1X + Math.cos(angle0) * dis2;
        result[1] = L1Y + Math.sin(angle0) * dis2;
        if (dis2 < 0) return -1;
        else if (dis2 <= dis0)
            return 0;
        else
            return 1;
    },

    /**
     *求两点之间的距离
     *
     * @param {*} pt1X
     * @param {*} pt1Y
     * @param {*} pt2X
     * @param {*} pt2Y
     * @returns
     */
    TwoPointsDistance: (pt1X: number, pt1Y: number, pt2X: number, pt2Y: number) => Math.sqrt((pt1X - pt2X) * (pt1X - pt2X) + (pt1Y - pt2Y) * (pt1Y - pt2Y)),


    /**
     * 获得有向线矢量方向，返回值在 [0～2pai) 之间
     * @param X1
     * @param Y1
     * @param X2
     * @param Y2
     * @returns {*}
     */
    vecAngle: function (X1: number, Y1: number, X2: number, Y2: number) {
        let deltaX, deltaY;
        deltaX = X2 - X1;
        deltaY = Y2 - Y1;
        return this.normalizeVecAngle(Math.atan2(deltaY, deltaX));
    },


    /**
     * 角度归2Pi化，返回值在[0～2pai)之间
     * @param angle
     */
    normalizeVecAngle: (angle: number) => {
        let count = ~~(angle / (2 * Math.PI));
        return angle - count * (2 * Math.PI);
    },


    /**
     * 以距离和方向角的方式获得坐标点
     * @param centerX
     * @param centerY
     * @param vector
     * @param radius
     */
    polarPoint: function (centerX: number, centerY: number, vector: number, radius: number) {
        let point = new Array(2);
        point[0] = centerX + radius * Math.cos(vector);
        point[1] = centerY + radius * Math.sin(vector);
        return point;
    },


    /**
     *求两个方向之间的夹角,获得矢量夹角（从起始方向到终止方向，按逆时针）
     *
     * @param {*} direct1
     * @param {*} direct2
     * @returns
     */
    deltaAngle: function (direct1: number, direct2: number) {
        return this.normalizeVecAngle(direct2 - direct1);
    },


    /**
     * 线段插值，经纬度坐标插值
     * @param start
     * @param end
     * @returns {null|*[]}
     * @constructor
     */
    InterpolateLineLonlat: function (start: {
        lon: number;
        lat: number;
    }, end: {
        lon: number;
        lat: number;
    }) {
        if (start && end) {
        } else {
            return null;
        }
        if (start.lon && start.lat && end.lon && end.lat) {
        } else {
            return null;
        }
        if (CheckLonDegree(start.lon) && CheckLonDegree(end.lon) &&
            CheckLatDegree(start.lat) && CheckLatDegree(end.lat)) {
        } else {
            return null;
        }
        let result = [];
        result.push([start.lon, start.lat]);
        let interval = Math.sqrt(
            Math.pow((end.lon - start.lon), 2) + Math.pow((end.lat - start.lat), 2));
        if (interval <= this.DeltaDegree) {
            //小于最小间隔
            result.push([end.lon, end.lat]);
            return result;
        } else {
            let num = interval / this.DeltaDegree;
            let stepLon = (end.lon - start.lon) / num;
            let stepLat = (end.lat - start.lat) / num;
            for (let i = 0; i < num; i++) {
                let lon = start.lon + (i + 1) * stepLon;
                let lat = start.lat + (i + 1) * stepLat;
                result.push([lon, lat]);
            }
        }
        return result;
    },


    /**
     *计算线的方向向量
     *
     * @param {*} lonStart
     * @param {*} latStart
     * @param {*} lonEnd
     * @param {*} latEnd
     * @param {*} normal
     * @returns
     */
    computeLineNormal: function (lonStart: number, latStart: number, lonEnd: number, latEnd: number, normal: Cartesian3) {
        let lineStartX = this.lon_to_meter(lonStart, latStart);
        let lineStartY = this.lat_to_meter(latStart);

        let lineEndX = this.lon_to_meter(lonEnd, latEnd);
        let lineEndY = this.lat_to_meter(latEnd);

        let lineCenterX = (lineStartX + lineEndX) / 2;
        let lineCenterY = (lineStartY + lineEndY) / 2;

        //获得向量矢量
        let angle = this.vecAngle(lineStartX, lineStartY, lineEndX, lineEndY) -
            (Math.PI / 2);

        let point = this.polarPoint(lineCenterX, lineCenterY, angle, 1.0);

        let lineCenterLat = this.meter_to_lat(lineCenterY);
        let lineCenterLon = this.meter_to_long(lineCenterX, lineCenterLat);
        let lineCenterLat2 = this.meter_to_lat(point[1]);
        let lineCenterLon2 = this.meter_to_long(point[0], lineCenterLat2);

        let a = Cesium.Cartesian3.fromDegrees(lineCenterLon, lineCenterLat, 0);
        let b = Cesium.Cartesian3.fromDegrees(lineCenterLon2, lineCenterLat2, 0);
        let result = new Cesium.Cartesian3(b.x - a.x, b.y - a.y, b.z - a.z);
        normal = Cesium.Cartesian3.normalize(result, normal);
        return normal;
    },

    degree2rad: function (val: number) {
        return val * Math.PI / 180.0;
    },

    rad2degree: function (val: number) {
        return val * 180.0 / Math.PI;
    },

    //计算平面多边形面积
    //points   [[x,y],[x,y],[x,y]]
    computeArea: function (points: string | any[]) {
        let pointsNum = points.length;
        if (pointsNum < 3) return 0;
        let s = points[0][1] * (points[pointsNum - 1][0] - points[1][0]);
        for (let i = 1; i < pointsNum; i++) {
            s += points[i][1] * (points[i - 1][0] - points[(i + 1) % pointsNum][0]);
        }
        return Math.abs(s / 2.0);
    },


    //计算两点之间的距离
    calculationDistance: function (point1: {
        y: number;
        x: number;
    }, point2: {
        y: number;
        x: number;
    }) {
        let y1 = point1.y;
        let y2 = point2.y;
        let x1 = point1.x;
        let x2 = point2.x;

        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    },


    guid: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    },


    /**
     * 计算直角坐标系中值线于坐标轴X的交点
     * @param {*} start [x,y]
     * @param {*} end [x,y]
     * @param {*} center [x,y],x和y只需要输入一个，计算出另外一个
     */
    calculationIntersection: function (start: number[], end: number[], intersection: number[]) {
        if (intersection[0]) {
            intersection[1] = start[1] +
                ((intersection[0] - start[0]) * (end[1] - start[1]) /
                    (end[0] - start[0]));
        } else {
            intersection[0] = start[0] +
                ((end[0] - start[0]) * (intersection[1] - start[1]) /
                    (end[1] - start[1]));
        }
    }
    ,


    // 空间三点，计算平面角度
    calculateTriangle: function (positions: Cartesian3[]) {
        // 空间 三点 求角度，先转为二维

        let c = CartographicTool.formCartesian3S(positions);

        let point1 = window.turf.point([c[0].longitude, c[0].latitude]);
        let point2 = window.turf.point([c[1].longitude, c[1].latitude]);
        let point3 = window.turf.point([c[2].longitude, c[2].latitude]);

        let bearing1 = window.turf.bearing(point1, point2);
        let bearing2 = window.turf.bearing(point2, point3);

        bearing1 = bearing1 < 0 ? bearing1 + 360 : bearing1;
        bearing2 = bearing2 < 0 ? bearing2 + 360 : bearing2;

        // let AB = {
        //     x: positions[0].x - positions[1].x,
        //     y: positions[0].y - positions[1].y,
        //     z: positions[0].z - positions[1].z
        // };
        //
        // let BC = {
        //     x: positions[1].x - positions[2].x,
        //     y: positions[1].y - positions[2].y,
        //     z: positions[1].z - positions[2].z
        // };
        //
        // let AC = {
        //     x: positions[0].x - positions[2].x,
        //     y: positions[0].y - positions[2].y,
        //     z: positions[0].z - positions[2].z
        // };
        //
        // let ABLength = Math.sqrt((Math.pow(AB.x, 2) + Math.pow(AB.y, 2) + Math.pow(AB.z, 2)));
        // let BCLength = Math.sqrt((Math.pow(BC.x, 2) + Math.pow(BC.y, 2) + Math.pow(BC.z, 2)));
        // let ACLength = Math.sqrt((Math.pow(AC.x, 2) + Math.pow(AC.y, 2) + Math.pow(AC.z, 2)));
        //
        // let d = Math.acos(
        //     (ABLength ** 2 + BCLength ** 2 - ACLength ** 2) /
        //     (2 * BCLength * ACLength)
        // );

        let triangle = (180 - bearing1) + bearing2;
        triangle = triangle > 360 ? triangle - 360 : triangle;
        triangle = Math.abs(triangle);

        return triangle;
    },

    booleanClockwise,
    getClippingPlanes,
    cartesian3ToDegrees,
    getCirclePoint,
    generateCirclePoints,
    getHeight
};

export { GISMathUtils };
