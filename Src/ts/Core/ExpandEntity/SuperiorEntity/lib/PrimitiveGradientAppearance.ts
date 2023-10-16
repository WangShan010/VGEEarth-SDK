import { Cesium } from '../../../Impl/Declare';
import { Color } from 'cesium';

/**
 * @class 区域标注材质
 */
class PrimitiveGradientAppearance {
    /**
     * @constructor
     * @param {Color} color 颜色
     * @returns {MaterialAppearance} 着色后的材质
     */
    constructor(color: Color) {
        return new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        color: color
                    },
                    source: `
                    uniform vec4 color; 
                    czm_material czm_getMaterial(czm_materialInput materialInput)
                    {
                        czm_material material = czm_getDefaultMaterial(materialInput); 
                        vec2 st = materialInput.st;                        
                        float alpha = distance(st,vec2(0.5, 0.5)); 
                        material.alpha = color.a  * alpha  * 1.5; 
                        material.diffuse = color.rgb * 1.3;                            
                        return material;
                    }
                    `
                },
                translucent: true
            }),
            faceForward: false,
            closed: false
        });
    }
}

export { PrimitiveGradientAppearance };