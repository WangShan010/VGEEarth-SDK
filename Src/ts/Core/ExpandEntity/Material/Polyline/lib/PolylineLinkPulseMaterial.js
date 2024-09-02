// 动态线材质 脉冲线
import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';
// 动态线材质 脉冲
class PolylineLinkPulseMaterial extends PolylineBaseMaterial {
    constructor(options) {
        super();
        this._time = (new Date()).getTime();
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this.url = options.url || require('../img/脉冲线材质.png');
        this._time = (new Date()).getTime();
        this.init();
    }
    get isConstant() {
        return false;
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    getType() {
        return 'PolylineLinkPulse';
    }
    ;
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = this.url;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;
    }
    equals(other) {
        return this === other ||
            (other instanceof PolylineLinkPulseMaterial &&
                Cesium.Property.equals(this._color, other._color));
    }
    init() {
        Cesium.Material.PolylineLinkPulseType = 'PolylineLinkPulse';
        Cesium.Material.PolylineLinkPulseSource =
            'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
         { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
            vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
             material.alpha = colorImage.a * color.a;\n\
             material.diffuse = (colorImage.rgb + color.rgb)* 2.5 ;\n\
             return material;}';
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLinkPulseType, {
            fabric: {
                type: Cesium.Material.PolylineLinkPulseType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: '',
                    time: 20
                },
                source: Cesium.Material.PolylineLinkPulseSource
            },
            translucent: function () {
                return true;
            }
        });
    }
}
if (window.Cesium) {
    Object.defineProperties(PolylineLinkPulseMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}
export { PolylineLinkPulseMaterial };
