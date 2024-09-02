//尾迹线材质类
import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';
//尾迹线材质类
class PolylineTrailMaterial extends PolylineBaseMaterial {
    constructor(options) {
        super();
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this.colorSubscription = undefined;
        this.speed = options.speed || 6 * Math.random(); //速度
        this.color = options.color || Cesium.Color.RED; //颜色
        this.percent = options.percent || 0.1; //百分比
        this.gradient = options.gradient || 0.01; //渐变
        this.init();
    }
    get isConstant() {
        return false;
    }
    get definitionChanged() {
        return this._definitionChanged;
    }
    getType() {
        return 'PolylineTrail';
    }
    ;
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color);
        result.speed = this.speed;
        result.gradient = this.gradient;
        result.percent = this.percent;
        return result;
    }
    ;
    equals(other) {
        return this === other ||
            (other instanceof PolylineTrailMaterial &&
                this.speed == other.speed &&
                Cesium.Property.equals(this.color, other.color));
    }
    ;
    init() {
        Cesium.Material.PolylineTrailType = 'PolylineTrail';
        Cesium.Material.PolylineTrailSource = `uniform vec4 color;
        uniform float speed;
        uniform float percent;
        uniform float gradient;
        
        czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            float t =fract(czm_frameNumber * speed / 1000.0);
            t *= (1.0 + percent);
            float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
            alpha += gradient;
            material.diffuse = color.rgb;
            material.alpha = alpha;
            return material;
        }`;
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
            fabric: {
                type: Cesium.Material.PolylineTrailType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    transparent: true,
                    speed: 0,
                    gradient: 0.01,
                    percent: 0.1
                },
                source: Cesium.Material.PolylineTrailSource
            },
            translucent: function () {
                return true;
            }
        });
    }
}
if (window.Cesium) {
    Object.defineProperties(PolylineTrailMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}
export { PolylineTrailMaterial };
