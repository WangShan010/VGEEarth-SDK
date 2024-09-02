import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';
/**
 * 动态线材质 箭头
 */
class PolylineArrowMaterial extends PolylineBaseMaterial {
    constructor(options) {
        super();
        this._time = (new Date()).getTime();
        this.color = options.color;
        this.duration = options.duration;
        this.url = options.url || require('../img/箭头线材质.png');
        this.repeatCount = options.repeatCount;
        this.init();
    }
    get isConstant() {
        return false;
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    getType() {
        return 'PolylineArrowOpacity';
    }
    ;
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = this.url;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        result.repeatCount = this.repeatCount || 4;
        return result;
    }
    ;
    equals(other) {
        return this === other ||
            (other instanceof PolylineArrowMaterial &&
                Cesium.Property.equals(this._color, other._color) &&
                this.duration == other.duration &&
                this.repeatCount == other.repeatCount);
    }
    ;
    init() {
        Cesium.Material.PolylineArrowOpacityType = 'PolylineArrowOpacity';
        Cesium.Material.PolylineArrowOpacitySource =
            'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
         { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
            vec4 colorImage = texture(image, vec2(fract( count * st.s - time),fract(st.t)));\n\
             material.alpha =  colorImage.a * color.a;\n\
             material.diffuse =  color.rgb * 3.0 ;\n\
             return material;}';
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineArrowOpacityType, {
            fabric: {
                type: Cesium.Material.PolylineArrowOpacityType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: '',
                    time: 20,
                    count: this.repeatCount || 4
                },
                source: Cesium.Material.PolylineArrowOpacitySource
            },
            translucent: () => {
                return true;
            }
        });
    }
}
if (window.Cesium) {
    Object.defineProperties(PolylineArrowMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}
export { PolylineArrowMaterial };
