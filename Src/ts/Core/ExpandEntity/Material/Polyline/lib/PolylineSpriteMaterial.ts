// 精灵线
import { Cesium } from '../../../../Impl/Declare';
import { PolylineBaseMaterial } from './PolylineBaseMaterial';

class PolylineSpriteMaterial extends PolylineBaseMaterial {
    private duration: number;
    private url: string;
    private _time: number;

    constructor(options: { duration: number, url: string }) {
        super();
        this.duration = options.duration || 2000;
        this.url = options.url || require('../img/精灵线材质01.png');
        this._time = performance.now();
        this.init();
    }

    equals(other: PolylineSpriteMaterial): boolean {
        return this === other || (other instanceof PolylineSpriteMaterial && this.duration === other.duration);
    }

    getType(): string {
        return 'PolylineSprite';
    }

    getValue(time: number, result: any): any {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.image = this.url;
        result.time = ((performance.now() - this._time) % this.duration) / this.duration;
        return result;
    }

    init(): void {

        Cesium.Material.PolylineSpriteType = 'PolylineSprite';
        Cesium.Material.PolylineSpriteSource =
            'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
              {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
                    material.alpha = colorImage.a;\n\
                    material.diffuse = colorImage.rgb * 1.5 ;\n\
                    return material;\n\
            }';
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineSpriteType, {

            fabric: {
                type: Cesium.Material.PolylineSpriteType,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: '',
                    transparent: true,
                    time: 20
                },
                source: Cesium.Material.PolylineSpriteSource
            },

            translucent: () => {
                return true;
            }
        });
    }
}


if (window.Cesium) {
    Object.defineProperties(PolylineSpriteMaterial.prototype, {
        color: Cesium.createPropertyDescriptor('color')
    });
}


export { PolylineSpriteMaterial };