// 尾迹线流动
import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';
//尾迹线 流动
class PolylineTrialFlowMaterial extends PolylineBaseMaterial {
    constructor(options) {
        super();
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this._time = performance.now();
        this.init();
    }
    get isConstant() {
        return false;
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    getType() {
        return 'PolylineTrialFlow';
    }
    ;
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.time = ((performance.now() - this._time) % this.duration) / this.duration;
        return result;
    }
    ;
    equals(other) {
        return this === other ||
            (other instanceof PolylineTrialFlowMaterial &&
                this.duration == other.duration &&
                Cesium.Property.equals(this._color, other._color));
    }
    ;
    init() {
        Cesium.Material.PolylineTrialFlowType = 'PolylineTrialFlow';
        Cesium.Material.PolylineTrialFlowSource = 'czm_material czm_getMaterial(czm_materialInput materialInput)\n' +
            '{\n' +
            '    czm_material material = czm_getDefaultMaterial(materialInput);\n' +
            '    vec2 st = materialInput.st;\n' +
            '    float t = time;\n' +
            '    t *= 1.03;\n' +
            '    float alpha = smoothstep(t- 0.1, t, st.s) * step(-t, -st.s);\n' +
            '    alpha += 0.1;\n' +
            '    material.diffuse= color.rgb;\n' +
            '    material.alpha = alpha;\n' +
            '    return material;\n' +
            '}\n';
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrialFlowType, {
            fabric: {
                type: Cesium.Material.PolylineTrialFlowType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    transparent: true,
                    time: 20
                },
                source: Cesium.Material.PolylineTrialFlowSource
            },
            translucent: function () {
                return true;
            }
        });
    }
}
if (window.Cesium) {
    Object.defineProperties(PolylineTrialFlowMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}
export { PolylineTrialFlowMaterial };
