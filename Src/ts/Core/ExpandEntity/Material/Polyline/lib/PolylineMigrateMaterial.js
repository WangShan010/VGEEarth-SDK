import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';
//迁徙线
class PolylineMigrateMaterial extends PolylineBaseMaterial {
    constructor(options) {
        super();
        options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._color = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this.url = options.url || require('../img/迁徙线材质.png');
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
        return 'PolylineMigrate';
    }
    ;
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = this.url;
        result.time = ((performance.now() - this._time) % this.duration) / this.duration;
        return result;
    }
    equals(other) {
        return this === other ||
            (other instanceof PolylineMigrateMaterial &&
                Cesium.Property.equals(this._color, other._color) &&
                this.duration == other.duration);
    }
    init() {
        Cesium.Material.PolylineMigrateType = 'PolylineMigrate';
        Cesium.Material.PolylineMigrateSource =
            'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
                    material.alpha = colorImage.a * color.a;\n\
                    material.diffuse = color.rgb*1.5;\n\
                    return material;\n\
            }';
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineMigrateType, {
            fabric: {
                type: Cesium.Material.PolylineMigrateType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: '',
                    transparent: true,
                    time: 20
                },
                source: Cesium.Material.PolylineMigrateSource
            },
            translucent: function () {
                return true;
            }
        });
    }
}
if (window.Cesium) {
    Object.defineProperties(PolylineMigrateMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}
export { PolylineMigrateMaterial };
