// 线材质

import { Cesium } from '../../../../Impl/Declare';
import { Color } from 'cesium';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';


// 线材质 超级线

class PolylineSuperMaterial extends PolylineBaseMaterial {
    private _time: number = (new Date()).getTime();
    private count: number;
    private url: string;
    private duration: number;
    private color: Color;
    private _color: undefined;

    constructor(options: any) {
        super();
        this._color = undefined;
        this.color = options.color;
        this.duration = options.duration;
        this.count = options.count;
        this.url = options.url || require('../img/超级线材质01.png');
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
        return 'PolylineSuper';
    };

    getValue(time: number, result: any) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = this.url;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        result.count = this.count || 4;
        return result;
    };

    equals(other: PolylineSuperMaterial) {
        return this === other ||
            (other instanceof PolylineSuperMaterial &&
                Cesium.Property.equals(this._color, other._color) &&
                this.duration == other.duration &&
                this.count == other.count &&
                this.url == other.url
            );

    };

    init() {
        Cesium.Material.PolylineSuperType = 'PolylineSuper';
        Cesium.Material.PolylineSuperSource =
            'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
         { czm_material material = czm_getDefaultMaterial(materialInput); vec2 st = materialInput.st;\n\
            vec4 colorImage = texture(image, vec2(fract( count * st.s - time),fract(st.t)));\n\
             material.alpha =  colorImage.a * color.a;\n\
             material.diffuse =  color.rgb * 1.5 ;\n\
             return material;}';

        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineSuperType, {
            fabric: {
                type: Cesium.Material.PolylineSuperType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: '',
                    time: 20,
                    count: 4
                },
                source: Cesium.Material.PolylineSuperSource
            },
            translucent: function () {
                return true;
            }
        });
    }
}


if (window.Cesium) {
    Object.defineProperties(PolylineSuperMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}


export { PolylineSuperMaterial };