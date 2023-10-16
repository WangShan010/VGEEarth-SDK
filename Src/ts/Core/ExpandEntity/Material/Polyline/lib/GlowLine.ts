import { Cesium } from '../../../../Impl/Declare';
import { Color } from 'cesium';

type GlowMaterialOptionType = {
    color?: Color
    glowPower?: number
    opacity?: number
}

/**
 * 光晕线
 * @param {string} geoJsonURI geoJsonURI
 * @param {number} width 可选，线粗，默认为12
 * @param {GlowMaterialOptionType} material 可选，材质，默认为{
 *      color: Cesium.Color.fromCssColorString('#FF4500'),
 *      glowPower: 0.2,
 *      opacity: 0.8,
 *  }
 * @returns { GeoJsonDataSource } 返回一个线实例
 */
async function GlowLine(
    geoJsonURI: string, width = 12,
    material: GlowMaterialOptionType = {
        color: Cesium.Color.fromCssColorString('#FF4500'),
        glowPower: 0.2,
        opacity: 0.8
    }) {
    let glowLine = await Cesium.GeoJsonDataSource.load(geoJsonURI);
    if (!glowLine) return;
    let values = glowLine.entities.values;
    for (var i = 0; i < values.length; i++) {
        var line = values[i];
        line.polyline!.material = new Cesium.PolylineGlowMaterialProperty({ //设置Glow材质
            color: material.color,
            glowPower: material.glowPower,
            opacity: material.opacity
        });
        line.polyline.width = width;
    }
    return glowLine;
}

export { GlowLine };