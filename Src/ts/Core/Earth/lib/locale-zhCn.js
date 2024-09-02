import { Cesium } from '../../Impl/Declare';
// cesium时钟时间格式化函数
function CesiumTimeFormatter(datetime) {
    let julianDT = new Cesium.JulianDate();
    Cesium.JulianDate.addHours(datetime, 8, julianDT);
    let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
    let hour = gregorianDT.hour + '';
    let minute = gregorianDT.minute + '';
    let second = gregorianDT.second + '';
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
}
// cesium时钟日期格式化函数
function CesiumDateFormatter(datetime) {
    let julianDT = new Cesium.JulianDate();
    Cesium.JulianDate.addHours(datetime, 8, julianDT);
    let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
    let month = gregorianDT.month + '';
    let day = gregorianDT.day + '';
    return `${gregorianDT.year}年${month.padStart(2, '0')}月${day.padStart(2, '0')}日`;
}
// cesium时间轴格式化函数
function CesiumDateTimeFormatter(datetime) {
    let julianDT = new Cesium.JulianDate();
    Cesium.JulianDate.addHours(datetime, 8, julianDT);
    let gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
    let year = gregorianDT.year + '';
    let month = gregorianDT.month + '';
    let day = gregorianDT.day + '';
    let hour = gregorianDT.hour + '';
    let minute = gregorianDT.minute + '';
    let seconds = gregorianDT.second + '';
    return `${year}年${month.padStart(2, '0')}月${day.padStart(2, '0')}日 ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}
export { CesiumTimeFormatter, CesiumDateFormatter, CesiumDateTimeFormatter };
