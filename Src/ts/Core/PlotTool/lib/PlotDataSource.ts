// @ts-nocheck

import { Cesium } from '../../Impl/Declare';
import { SimpleLabelDecorator } from '../../ExpandEntity/SuperiorEntity/lib/SimpleLabelDecorator';
import { DeviceStatusWindowDecorator } from '../../ExpandEntity/SuperiorEntity/lib/DeviceStatusWindowDecorator';
import { PopupWindow1Decorator } from '../../ExpandEntity/SuperiorEntity/lib/PopupWindow1Decorator';
import { PopupWindow2Decorator } from '../../ExpandEntity/SuperiorEntity/lib/PopupWindow2Decorator';
import { HlsVideoWindowDecorator } from '../../ExpandEntity/SuperiorEntity/lib/HlsVideoWindowDecorator';
import { particleJudgment } from './particleJudgment';

/**
 * @typedef {Object} PlotDataSource.LoadOptions
 *
 * Initialization options for the `load` method.
 *
 * @property {String} [sourceUri] Overrides the url to use for resolving relative links.
 * @property {Number} [markerSize=PlotDataSource.markerSize] The default size of the map pin created for each point, in pixels.
 * @property {String} [markerSymbol=PlotDataSource.markerSymbol] The default symbol of the map pin created for each point.
 * @property {Color} [markerColor=PlotDataSource.markerColor] The default color of the map pin created for each point.
 * @property {Color} [stroke=PlotDataSource.stroke] The default color of polylines and polygon outlines.
 * @property {Number} [strokeWidth=PlotDataSource.strokeWidth] The default width of polylines and polygon outlines.
 * @property {Color} [fill=PlotDataSource.fill] The default color for polygon interiors.
 * @property {Boolean} [clampToGround=PlotDataSource.clampToGround] true if we want the geometry features (polygons or linestrings) clamped to the ground.
 * @property {Credit|String} [credit] A credit for the data source, which is displayed on the canvas.
 */

/**
 * A {@link DataSource} which processes both
 * {@link http://www.geojson.org/|GeoJSON} and {@link https://github.com/mbostock/topojson|TopoJSON} data.
 * {@link https://github.com/mapbox/simplestyle-spec|simplestyle-spec} properties will also be used if they
 * are present.
 *
 * @alias PlotDataSource
 * @constructor
 *
 * @param {String} [name] The name of this data source.  If undefined, a name will be taken from
 *                        the name of the GeoJSON file.
 *
 * @demo {@link https://sandcastle.cesium.com/index.html?src=GeoJSON%20and%20TopoJSON.html|Cesium Sandcastle GeoJSON and TopoJSON Demo}
 * @demo {@link https://sandcastle.cesium.com/index.html?src=GeoJSON%20simplestyle.html|Cesium Sandcastle GeoJSON simplestyle Demo}
 *
 * @example
 * const viewer = new Cesium.Viewer('cesiumContainer');
 * viewer.dataSources.add(Cesium.PlotDataSource.load('../../SampleData/ne_10m_us_states.topojson', {
 *   stroke: Cesium.Color.HOTPINK,
 *   fill: Cesium.Color.PINK,
 *   strokeWidth: 3,
 *   markerSymbol: '?'
 * }));
 */

class PlotDataSource {
    name: string;
    entities: any;

    constructor(name) {
        this._name = name;
        this._changed = new Event();
        this._error = new Event();
        this._isLoading = false;
        this._loading = new Event();
        this._entityCollection = new EntityCollection(this);
        this._promises = [];
        this._pinBuilder = new PinBuilder();
        this._entityCluster = new EntityCluster();
        this._credit = undefined;
        this._resourceCredits = [];
    }


    /**
     * Creates a Promise to a new instance loaded with the provided GeoJSON or TopoJSON data.
     *
     * @param {Resource|String|Object} data A url, GeoJSON object, or TopoJSON object to be loaded.
     * @param {PlotDataSource.LoadOptions} [options] An object specifying configuration options
     *
     * @returns {Promise.<PlotDataSource>} A promise that will resolve when the data is loaded.
     */
    load(data, options) {
        return new PlotDataSource().load(data, options);
    };
}

let ArcType = Cesium.ArcType;
let Cartesian2 = Cesium.Cartesian2;
let Cartesian3 = Cesium.Cartesian3;
let Color = Cesium.Color;
let createGuid = Cesium.createGuid;
let Credit = Cesium.Credit;
let defaultValue = Cesium.defaultValue;
let DeveloperError = Cesium.DeveloperError;
let Event = Cesium.Event;
let getFilenameFromUri = Cesium.getFilenameFromUri;
let PinBuilder = Cesium.PinBuilder;
let PolygonHierarchy = Cesium.PolygonHierarchy;
let Resource = Cesium.Resource;
let RuntimeError = Cesium.RuntimeError;
let HeightReference = Cesium.HeightReference;
let NearFarScalar = Cesium.NearFarScalar;
let HorizontalOrigin = Cesium.HorizontalOrigin;
let LabelGraphics = Cesium.LabelGraphics;
let LabelStyle = Cesium.LabelStyle;
let VerticalOrigin = Cesium.VerticalOrigin;
let topojson = Cesium.topojson;
let BillboardGraphics = Cesium.BillboardGraphics;
let CallbackProperty = Cesium.CallbackProperty;
let ColorMaterialProperty = Cesium.ColorMaterialProperty;
let ConstantPositionProperty = Cesium.ConstantPositionProperty;
let ConstantProperty = Cesium.ConstantProperty;
let DataSource = Cesium.DataSource;
let EntityCluster = Cesium.EntityCluster;
let EntityCollection = Cesium.EntityCollection;
let PolygonGraphics = Cesium.PolygonGraphics;
let PolylineGraphics = Cesium.PolylineGraphics;
let defined = Cesium.defined;

function defaultCrsFunction(coordinates) {
    return Cartesian3.fromDegrees(coordinates[0], coordinates[1], coordinates[2]);
}

const crsNames = {
    'urn:ogc:def:crs:OGC:1.3:CRS84': defaultCrsFunction,
    'EPSG:4326': defaultCrsFunction,
    'urn:ogc:def:crs:EPSG::4326': defaultCrsFunction
};

const crsLinkHrefs = {};
const crsLinkTypes = {};
let defaultMarkerSize = 48;
let defaultMarkerSymbol;
let defaultMarkerColor = Color.ROYALBLUE;
let defaultStroke = Color.YELLOW;
let defaultStrokeWidth = 1;
let defaultFill = Color.fromBytes(255, 255, 0, 100);
let defaultClampToGround = false;

const sizes = {
    small: 24,
    medium: 48,
    large: 64
};

const BILLBOARD_SIZE = 32;

const BILLBOARD_NEAR_DISTANCE = 2414016;
const BILLBOARD_NEAR_RATIO = 1.0;
const BILLBOARD_FAR_DISTANCE = 1.6093e7;
const BILLBOARD_FAR_RATIO = 0.1;


const simpleStyleIdentifiers = ['title', 'description', 'marker-size', 'marker-symbol', 'marker-color', 'stroke', 'stroke-opacity', 'stroke-width', 'fill', 'fill-opacity'];


function defaultDescribe(properties, nameProperty) {
    let html = '';
    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            if (key === nameProperty || simpleStyleIdentifiers.indexOf(key) !== -1) {
                continue;
            }
            const value = properties[key];
            if (defined(value)) {
                if (typeof value === 'object') {
                    html += `<tr><th>${key}</th><td>${defaultDescribe(value)}</td></tr>`;
                } else {
                    html += `<tr><th>${key}</th><td>${value}</td></tr>`;
                }
            }
        }
    }

    if (html.length > 0) {
        html = `<table class="cesium-infoBox-defaultTable"><tbody>${html}</tbody></table>`;
    }

    return html;
}

function createDescriptionCallback(describe, properties, nameProperty) {
    let description;
    return function (time, result) {
        if (!defined(description)) {
            description = describe(properties, nameProperty);
        }
        return description;
    };
}

function defaultDescribeProperty(properties, nameProperty) {
    return new CallbackProperty(createDescriptionCallback(defaultDescribe, properties, nameProperty), true);
}

//GeoJSON specifies only the Feature object has a usable id property
//But since "multi" geometries create multiple entity,
//we can't use it for them either.
function createObject(geoJson, entityCollection, describe) {
    let id = geoJson.id || geoJson.properties.id;
    if (!defined(id) || geoJson.type !== 'Feature') {
        id = createGuid();
    } else {
        let i = 2;
        let finalId = id;
        while (defined(entityCollection.getById(finalId))) {
            finalId = `${id}_${i}`;
            i++;
        }
        id = finalId;
    }

    const entity = entityCollection.getOrCreateEntity(id);
    const properties = geoJson.properties;
    if (defined(properties)) {
        entity.properties = properties;

        let nameProperty;

        //Check for the simplestyle specified name first.
        const name = properties.title;
        if (defined(name)) {
            entity.name = name;
            nameProperty = 'title';
        } else {
            //Else, find the name by selecting an appropriate property.
            //The name will be obtained based on this order:
            //1) The first case-insensitive property with the name 'title',
            //2) The first case-insensitive property with the name 'name',
            //3) The first property containing the word 'title'.
            //4) The first property containing the word 'name',
            let namePropertyPrecedence = Number.MAX_VALUE;
            for (const key in properties) {
                if (properties.hasOwnProperty(key) && properties[key]) {
                    const lowerKey = key.toLowerCase();

                    if (namePropertyPrecedence > 1 && lowerKey === 'title') {
                        namePropertyPrecedence = 1;
                        nameProperty = key;
                        break;
                    } else if (namePropertyPrecedence > 2 && lowerKey === 'name') {
                        namePropertyPrecedence = 2;
                        nameProperty = key;
                    } else if (namePropertyPrecedence > 3 && /title/i.test(key)) {
                        namePropertyPrecedence = 3;
                        nameProperty = key;
                    } else if (namePropertyPrecedence > 4 && /name/i.test(key)) {
                        namePropertyPrecedence = 4;
                        nameProperty = key;
                    }
                }
            }
            if (defined(nameProperty)) {
                entity.name = properties[nameProperty];
            }
        }

        const description = properties.description;
        if (description !== null) {
            entity.description = !defined(description) ? describe(properties, nameProperty) : new ConstantProperty(description);
        }
    }
    return entity;
}

function coordinatesArrayToCartesianArray(coordinates, crsFunction) {
    const positions = new Array(coordinates.length);
    for (let i = 0; i < coordinates.length; i++) {
        positions[i] = crsFunction(coordinates[i]);
    }
    return positions;
}

const geoJsonObjectTypes = {
    Feature: processFeature,
    FeatureCollection: processFeatureCollection,
    GeometryCollection: processGeometryCollection,
    LineString: processLineString,
    MultiLineString: processMultiLineString,
    MultiPoint: processMultiPoint,
    MultiPolygon: processMultiPolygon,
    Point: processPoint,
    Polygon: processPolygon,
    Topology: processTopology
};

const geometryTypes = {
    GeometryCollection: processGeometryCollection,
    LineString: processLineString,
    MultiLineString: processMultiLineString,
    MultiPoint: processMultiPoint,
    MultiPolygon: processMultiPolygon,
    Point: processPoint,
    Polygon: processPolygon,
    Topology: processTopology
};

// GeoJSON processing functions
function processFeature(dataSource, feature, notUsed, crsFunction, options) {
    if (feature.geometry === null) {
        //Null geometry is allowed, so just create an empty entity instance for it.
        createObject(feature, dataSource._entityCollection, options.describe);
        return;
    }

    if (!defined(feature.geometry)) {
        throw new RuntimeError('feature.geometry is required.');
    }

    const geometryType = feature.geometry.type;
    const geometryHandler = geometryTypes[geometryType];
    if (!defined(geometryHandler)) {
        throw new RuntimeError(`Unknown geometry type: ${geometryType}`);
    }
    geometryHandler(dataSource, feature, feature.geometry, crsFunction, options);
}

function processFeatureCollection(dataSource, featureCollection, notUsed, crsFunction, options) {
    const features = featureCollection.features;
    for (let i = 0, len = features.length; i < len; i++) {
        processFeature(dataSource, features[i], undefined, crsFunction, options);
    }
}

function processGeometryCollection(dataSource, geoJson, geometryCollection, crsFunction, options) {
    const geometries = geometryCollection.geometries;
    for (let i = 0, len = geometries.length; i < len; i++) {
        const geometry = geometries[i];
        const geometryType = geometry.type;
        const geometryHandler = geometryTypes[geometryType];
        if (!defined(geometryHandler)) {
            throw new RuntimeError(`Unknown geometry type: ${geometryType}`);
        }
        geometryHandler(dataSource, geoJson, geometry, crsFunction, options);
    }
}

function createPoint(dataSource, geoJson, crsFunction, coordinates, options) {
    let name = options.name;
    let symbol = options.markerSymbol;
    let color = options.markerColor;
    let size = options.markerSize;
    let modelUrl = null;

    // 初始化属性
    const properties = geoJson.properties;
    if (defined(properties)) {
        const cssColor = properties['marker-color'];
        if (defined(cssColor)) {
            color = Color.fromCssColorString(cssColor);
        }

        size = defaultValue(sizes[properties['marker-size']], size);
        const markerSymbol = properties['marker-symbol'];
        if (defined(markerSymbol)) {
            symbol = markerSymbol;
        }

        modelUrl = properties['model-url'];
    }


    // 初始化 Entity
    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    entity.position = new ConstantPositionProperty(crsFunction(coordinates));

    // 渲染 name 的 Label
    if (defined(properties.name)) {
        entity.name = name;
        entity.label = creatLabel(properties.name);

    }

    // 渲染图标
    if (symbol) {
        let canvasOrPromise;
        if (defined(symbol)) {
            let isUrlExp = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');

            if (symbol.indexOf('data:image/') > -1) {
                canvasOrPromise = symbol;
            } else if (isUrlExp.test(symbol)) {
                canvasOrPromise = symbol;
            } else if (symbol.length === 1) {
                canvasOrPromise = dataSource._pinBuilder.fromText(symbol.toUpperCase(), color, size);
            } else {
                canvasOrPromise = dataSource._pinBuilder.fromMakiIconId(symbol, color, size);
            }
        } else {
            canvasOrPromise = dataSource._pinBuilder.fromColor(color, size);
        }

        const billboard = new BillboardGraphics();
        billboard.verticalOrigin = new ConstantProperty(VerticalOrigin.BOTTOM);
        billboard.width = BILLBOARD_SIZE;
        billboard.height = BILLBOARD_SIZE;
        billboard.scaleByDistance = new NearFarScalar(BILLBOARD_NEAR_DISTANCE, BILLBOARD_NEAR_RATIO, BILLBOARD_FAR_DISTANCE, BILLBOARD_FAR_RATIO);
        billboard.pixelOffsetScaleByDistance = new NearFarScalar(BILLBOARD_NEAR_DISTANCE, BILLBOARD_NEAR_RATIO, BILLBOARD_FAR_DISTANCE, BILLBOARD_FAR_RATIO);
        billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;

        // Clamp to ground if there isn't a height specified
        if (coordinates.length === 2 || options.clampToGround) {
            billboard.heightReference = HeightReference.CLAMP_TO_GROUND;
        }

        entity.billboard = billboard;

        const promise = Promise.resolve(canvasOrPromise)
            .then(function (image) {
                billboard.image = new ConstantProperty(image);
            })
            .catch(function () {
                billboard.image = new ConstantProperty(dataSource._pinBuilder.fromColor(color, size));
            });
    }


    // 渲染模型
    if (modelUrl) {
        entity.model = new Cesium.ModelGraphics({
            uri: modelUrl,
            minimumPixelSize: 64,
            maximumScale: 2000
        });
    }

    if (properties.code === 'winInfo-SimpleLabel') {
        new SimpleLabelDecorator(entity, properties['内容']);
    }
    if (properties.code === 'winInfo-Bubble-1') {
        new PopupWindow1Decorator(entity, {
            title: properties['paramList'][0]['value'],
            html: properties['paramList'][1]['value']
        });
    }
    if (properties.code === 'winInfo-Bubble-2') {
        new PopupWindow2Decorator(entity, {
            title: properties['paramList'][0]['value'],
            html: properties['paramList'][1]['value']
        });
    }
    if (properties.code === 'winInfo-device') {
        new DeviceStatusWindowDecorator(entity, {
            title: properties['paramList'][0]['value'],
            html: properties['paramList'][1]['value'],
            color: properties['颜色']
        });
    }
    if (properties.code === 'winInfo-HLS') {
        new HlsVideoWindowDecorator(entity, {
            title: properties.paramList[0].value,
            url: properties.paramList[1].value
        });
    }

    // dataSource._promises.push(promise);
}

function creatLabel(name = '标记') {
    const label = new LabelGraphics();
    label.translucencyByDistance = new NearFarScalar(3000000, 1.0, 5000000, 0.0);
    label.pixelOffset = new Cartesian2(0, -45);
    label.horizontalOrigin = HorizontalOrigin.CENTER;
    label.font = '16px sans-serif';
    label.style = LabelStyle.FILL_AND_OUTLINE;
    label.text = name;


    label.font = '12pt bold monospace';
    label.fillColor = Cesium.Color.WHITE;
    label.outlineColor = Cesium.Color.BLACK;
    label.outlineWidth = 4;
    label.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
    label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    return label;
}

function processPoint(dataSource, geoJson, geometry, crsFunction, options) {
    createPoint(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiPoint(dataSource, geoJson, geometry, crsFunction, options) {
    const coordinates = geometry.coordinates;
    for (let i = 0; i < coordinates.length; i++) {
        createPoint(dataSource, geoJson, crsFunction, coordinates[i], options);
    }
}

function createLineString(dataSource, geoJson, crsFunction, coordinates, options) {
    let material = options.strokeMaterialProperty;
    let widthProperty;

    const properties = geoJson.properties;
    if (defined(properties)) {
        const strokeMaterial = properties['stroke-material'] || 'normal';
        const strokeWidth = properties['stroke-width'] || 12;

        widthProperty = new ConstantProperty(strokeWidth);
        switch (strokeMaterial) {
            case 'PolylineArrowMaterial':
                material = new VGEEarth.Material.Polyline.PolylineArrowMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 800,
                    count: 3
                });
                break;
            case 'PolylineEnergyTransMaterial':
                material = new VGEEarth.Material.Polyline.PolylineEnergyTransMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 800,
                    count: 3
                });
                break;
            case 'PolylineLightingMaterial':
                material = new VGEEarth.Material.Polyline.PolylineLightingMaterial();
                break;
            case 'PolylineLinkPulseMaterial':
                material = new VGEEarth.Material.Polyline.PolylineLinkPulseMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 5000
                });
                break;
            case 'PolylineSpriteMaterial':
                material = new VGEEarth.Material.Polyline.PolylineSpriteMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 2000
                });
                break;
            case 'PolylineSuperMaterial':
                material = new VGEEarth.Material.Polyline.PolylineSuperMaterial({
                    color: Cesium.Color.AQUA,
                    duration: 2000
                });
                break;
            case 'PolylineTrailMaterial':
                material = new VGEEarth.Material.Polyline.PolylineTrailMaterial({
                    speed: 5 * Math.random(),
                    color: Cesium.Color.CYAN,
                    percent: 0.5,
                    gradient: 0.01
                });
                break;
            default: {
                const width = properties['stroke-width'];
                if (defined(width)) {
                    widthProperty = new ConstantProperty(12);
                } else {
                    widthProperty = options.strokeWidthProperty;
                }

                let color;
                const stroke = properties.stroke;
                if (defined(stroke)) {
                    color = Color.fromCssColorString(stroke);
                }
                const opacity = properties['stroke-opacity'];
                if (defined(opacity) && opacity !== 1.0) {
                    if (!defined(color)) {
                        color = material.color.getValue().clone();
                    }
                    color.alpha = opacity;
                }
                if (defined(color)) {
                    material = new ColorMaterialProperty(color);
                }
            }
        }
    }

    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    const polylineGraphics = new PolylineGraphics();
    entity.polyline = polylineGraphics;

    polylineGraphics.clampToGround = options.clampToGround;
    polylineGraphics.material = material;
    polylineGraphics.width = widthProperty;
    polylineGraphics.positions = new ConstantProperty(coordinatesArrayToCartesianArray(coordinates, crsFunction));
    polylineGraphics.arcType = ArcType.GEODESIC;
}

function processLineString(dataSource, geoJson, geometry, crsFunction, options) {
    createLineString(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiLineString(dataSource, geoJson, geometry, crsFunction, options) {
    const lineStrings = geometry.coordinates;
    for (let i = 0; i < lineStrings.length; i++) {
        createLineString(dataSource, geoJson, crsFunction, lineStrings[i], options);
    }
}

function createPolygon(dataSource, geoJson, crsFunction, coordinates, options) {
    if (coordinates.length === 0 || coordinates[0].length === 0) {
        return;
    }

    let material = options.fillMaterialProperty;
    let widthProperty = options.strokeWidthProperty;

    const properties = geoJson.properties || {};
    if (defined(properties)) {
        let fillColor;
        const fill = properties.fill;
        const materialColor = material.color.getValue();
        if (defined(fill)) {
            fillColor = Color.fromCssColorString(fill);
            fillColor.alpha = materialColor.alpha;
        }
        let opacity = properties['fill-opacity'];
        if (defined(opacity) && opacity !== materialColor.alpha) {
            if (!defined(fillColor)) {
                fillColor = materialColor.clone();
            }
            fillColor.alpha = opacity;
        }
        if (defined(fillColor)) {
            material = new ColorMaterialProperty(fillColor);
        }
    }

    const polygon = new PolygonGraphics();
    polygon.material = material;
    polygon.arcType = ArcType.GEODESIC;

    const polylineGraphics = new PolylineGraphics();
    polylineGraphics.clampToGround = options.clampToGround;
    polylineGraphics.material = properties.stroke ? new ColorMaterialProperty(Color.fromCssColorString(properties.stroke)) : options.strokeMaterialProperty;
    polylineGraphics.width = properties['stroke-width'] || widthProperty;
    polylineGraphics.alpha = properties['stroke-opacity'] || 1.0;
    polylineGraphics.positions = new ConstantProperty(coordinatesArrayToCartesianArray(coordinates[0], crsFunction));
    polylineGraphics.arcType = ArcType.GEODESIC;


    const holes = [];
    for (let i = 1, len = coordinates.length; i < len; i++) {
        holes.push(new PolygonHierarchy(coordinatesArrayToCartesianArray(coordinates[i], crsFunction)));
    }

    const positions = coordinates[0];
    polygon.hierarchy = new ConstantProperty(new PolygonHierarchy(coordinatesArrayToCartesianArray(positions, crsFunction), holes));
    if (positions[0].length > 2) {
        polygon.perPositionHeight = new ConstantProperty(true);
    } else if (!options.clampToGround) {
        polygon.height = 0;
    }

    const entity = createObject(geoJson, dataSource._entityCollection, options.describe);
    entity.polygon = polygon;
    entity.polyline = polylineGraphics;
}

function processPolygon(dataSource, geoJson, geometry, crsFunction, options) {
    createPolygon(dataSource, geoJson, crsFunction, geometry.coordinates, options);
}

function processMultiPolygon(dataSource, geoJson, geometry, crsFunction, options) {
    const polygons = geometry.coordinates;
    for (let i = 0; i < polygons.length; i++) {
        createPolygon(dataSource, geoJson, crsFunction, polygons[i], options);
    }
}

function processTopology(dataSource, geoJson, geometry, crsFunction, options) {
    for (const property in geometry.objects) {
        if (geometry.objects.hasOwnProperty(property)) {
            const feature = topojson.feature(geometry, geometry.objects[property]);
            const typeHandler = geoJsonObjectTypes[feature.type];
            typeHandler(dataSource, feature, feature, crsFunction, options);
        }
    }
}

Object.defineProperties(PlotDataSource, {
    /**
     * Gets or sets the default size of the map pin created for each point, in pixels.
     * @memberof PlotDataSource
     * @type {Number}
     * @default 48
     */
    markerSize: {
        get: function () {
            return defaultMarkerSize;
        },
        set: function (value) {
            defaultMarkerSize = value;
        }
    },
    /**
     * Gets or sets the default symbol of the map pin created for each point.
     * This can be any valid {@link http://mapbox.com/maki/|Maki} identifier, any single character,
     * or blank if no symbol is to be used.
     * @memberof PlotDataSource
     * @type {String}
     */
    markerSymbol: {
        get: function () {
            return defaultMarkerSymbol;
        },
        set: function (value) {
            defaultMarkerSymbol = value;
        }
    },
    /**
     * Gets or sets the default color of the map pin created for each point.
     * @memberof PlotDataSource
     * @type {Color}
     * @default Color.ROYALBLUE
     */
    markerColor: {
        get: function () {
            return defaultMarkerColor;
        },
        set: function (value) {
            defaultMarkerColor = value;
        }
    },
    /**
     * Gets or sets the default color of polylines and polygon outlines.
     * @memberof PlotDataSource
     * @type {Color}
     * @default Color.BLACK
     */
    stroke: {
        get: function () {
            return defaultStroke;
        },
        set: function (value) {
            defaultStroke = value;
        }
    },
    /**
     * Gets or sets the default width of polylines and polygon outlines.
     * @memberof PlotDataSource
     * @type {Number}
     * @default 2.0
     */
    strokeWidth: {
        get: function () {
            return defaultStrokeWidth;
        },
        set: function (value) {
            defaultStrokeWidth = value;
        }
    },
    /**
     * Gets or sets default color for polygon interiors.
     * @memberof PlotDataSource
     * @type {Color}
     * @default Color.YELLOW
     */
    fill: {
        get: function () {
            return defaultFill;
        },
        set: function (value) {
            defaultFill = value;
        }
    },
    /**
     * Gets or sets default of whether to clamp to the ground.
     * @memberof PlotDataSource
     * @type {Boolean}
     * @default false
     */
    clampToGround: {
        get: function () {
            return defaultClampToGround;
        },
        set: function (value) {
            defaultClampToGround = value;
        }
    },

    /**
     * Gets an object that maps the name of a crs to a callback function which takes a GeoJSON coordinate
     * and transforms it into a WGS84 Earth-fixed Cartesian.  Older versions of GeoJSON which
     * supported the EPSG type can be added to this list as well, by specifying the complete EPSG name,
     * for example 'EPSG:4326'.
     * @memberof PlotDataSource
     * @type {Object}
     */
    crsNames: {
        get: function () {
            return crsNames;
        }
    },

    /**
     * Gets an object that maps the href property of a crs link to a callback function
     * which takes the crs properties object and returns a Promise that resolves
     * to a function that takes a GeoJSON coordinate and transforms it into a WGS84 Earth-fixed Cartesian.
     * Items in this object take precedence over those defined in <code>crsLinkHrefs</code>, assuming
     * the link has a type specified.
     * @memberof PlotDataSource
     * @type {Object}
     */
    crsLinkHrefs: {
        get: function () {
            return crsLinkHrefs;
        }
    },

    /**
     * Gets an object that maps the type property of a crs link to a callback function
     * which takes the crs properties object and returns a Promise that resolves
     * to a function that takes a GeoJSON coordinate and transforms it into a WGS84 Earth-fixed Cartesian.
     * Items in <code>crsLinkHrefs</code> take precedence over this object.
     * @memberof PlotDataSource
     * @type {Object}
     */
    crsLinkTypes: {
        get: function () {
            return crsLinkTypes;
        }
    }
});

Object.defineProperties(PlotDataSource.prototype, {
    /**
     * Gets or sets a human-readable name for this instance.
     * @memberof PlotDataSource.prototype
     * @type {String}
     */
    name: {
        get: function () {
            return this._name;
        },
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
                this._changed.raiseEvent(this);
            }
        }
    },
    /**
     * This DataSource only defines static data, therefore this property is always undefined.
     * @memberof PlotDataSource.prototype
     * @type {DataSourceClock}
     */
    clock: {
        value: undefined,
        writable: false
    },
    /**
     * Gets the collection of {@link Entity} instances.
     * @memberof PlotDataSource.prototype
     * @type {EntityCollection}
     */
    entities: {
        get: function () {
            return this._entityCollection;
        }
    },
    /**
     * Gets a value indicating if the data source is currently loading data.
     * @memberof PlotDataSource.prototype
     * @type {Boolean}
     */
    isLoading: {
        get: function () {
            return this._isLoading;
        }
    },
    /**
     * Gets an event that will be raised when the underlying data changes.
     * @memberof PlotDataSource.prototype
     * @type {Event}
     */
    changedEvent: {
        get: function () {
            return this._changed;
        }
    },
    /**
     * Gets an event that will be raised if an error is encountered during processing.
     * @memberof PlotDataSource.prototype
     * @type {Event}
     */
    errorEvent: {
        get: function () {
            return this._error;
        }
    },
    /**
     * Gets an event that will be raised when the data source either starts or stops loading.
     * @memberof PlotDataSource.prototype
     * @type {Event}
     */
    loadingEvent: {
        get: function () {
            return this._loading;
        }
    },
    /**
     * Gets whether or not this data source should be displayed.
     * @memberof PlotDataSource.prototype
     * @type {Boolean}
     */
    show: {
        get: function () {
            return this._entityCollection.show;
        },
        set: function (value) {
            this._entityCollection.show = value;
        }
    },

    /**
     * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
     *
     * @memberof PlotDataSource.prototype
     * @type {EntityCluster}
     */
    clustering: {
        get: function () {
            return this._entityCluster;
        },
        set: function (value) {
            //>>includeStart('debug', pragmas.debug);
            if (!defined(value)) {
                throw new DeveloperError('value must be defined.');
            }
            //>>includeEnd('debug');
            this._entityCluster = value;
        }
    },
    /**
     * Gets the credit that will be displayed for the data source
     * @memberof PlotDataSource.prototype
     * @type {Credit}
     */
    credit: {
        get: function () {
            return this._credit;
        }
    }
});

/**
 * Asynchronously loads the provided GeoJSON or TopoJSON data, replacing any existing data.
 *
 * @param {Resource|String|Object} data A url, GeoJSON object, or TopoJSON object to be loaded.
 * @param {Object} [options] An object with the following properties:
 * @param {String} [options.sourceUri] Overrides the url to use for resolving relative links.
 * @param {PlotDataSource.describe} [options.describe=PlotDataSource.defaultDescribeProperty] A function which returns a Property object (or just a string),
 *                                                                                which converts the properties into an html description.
 * @param {Number} [options.markerSize=PlotDataSource.markerSize] The default size of the map pin created for each point, in pixels.
 * @param {String} [options.markerSymbol=PlotDataSource.markerSymbol] The default symbol of the map pin created for each point.
 * @param {Color} [options.markerColor=PlotDataSource.markerColor] The default color of the map pin created for each point.
 * @param {Color} [options.stroke=PlotDataSource.stroke] The default color of polylines and polygon outlines.
 * @param {Number} [options.strokeWidth=PlotDataSource.strokeWidth] The default width of polylines and polygon outlines.
 * @param {Color} [options.fill=PlotDataSource.fill] The default color for polygon interiors.
 * @param {Boolean} [options.clampToGround=PlotDataSource.clampToGround] true if we want the features clamped to the ground.
 * @param {Credit|String} [options.credit] A credit for the data source, which is displayed on the canvas.
 *
 * @returns {Promise.<PlotDataSource>} a promise that will resolve when the GeoJSON is loaded.
 */
PlotDataSource.prototype.load = function (data, options) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined(data)) {
        throw new DeveloperError('data is required.');
    }
    //>>includeEnd('debug');

    DataSource.setLoading(this, true);
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);

    // User specified credit
    let credit = options.credit;
    if (typeof credit === 'string') {
        credit = new Credit(credit);
    }
    this._credit = credit;

    let promise = data;
    let sourceUri = options.sourceUri;
    if (typeof data === 'string' || data instanceof Resource) {
        data = Resource.createIfNeeded(data);
        promise = data.fetchJson();
        sourceUri = defaultValue(sourceUri, data.getUrlComponent());

        // Add resource credits to our list of credits to display
        const resourceCredits = this._resourceCredits;
        const credits = data.credits;
        if (defined(credits)) {
            const length = credits.length;
            for (let i = 0; i < length; i++) {
                resourceCredits.push(credits[i]);
            }
        }
    }

    options = {
        describe: defaultValue(options.describe, defaultDescribeProperty),
        markerSize: defaultValue(options.markerSize, defaultMarkerSize),
        markerSymbol: defaultValue(options.markerSymbol, defaultMarkerSymbol),
        markerColor: defaultValue(options.markerColor, defaultMarkerColor),
        strokeWidthProperty: new ConstantProperty(defaultValue(options.strokeWidth, defaultStrokeWidth)),
        strokeMaterialProperty: new ColorMaterialProperty(defaultValue(options.stroke, defaultStroke)),
        fillMaterialProperty: new ColorMaterialProperty(defaultValue(options.fill, defaultFill)),
        clampToGround: defaultValue(options.clampToGround, defaultClampToGround)
    };

    const that = this;
    return Promise.resolve(promise)
        .then(function (geoJson) {
            return load(that, geoJson, options, sourceUri);
        })
        .catch(function (error) {
            DataSource.setLoading(that, false);
            that._error.raiseEvent(that, error);
            return Promise.reject(error);
        });
};

/**
 * Updates the data source to the provided time.  This function is optional and
 * is not required to be implemented.  It is provided for data sources which
 * retrieve data based on the current animation time or scene state.
 * If implemented, update will be called by {@link DataSourceDisplay} once a frame.
 *
 * @param {JulianDate} time The simulation time.
 * @returns {Boolean} True if this data source is ready to be displayed at the provided time, false otherwise.
 */
PlotDataSource.prototype.update = function (time) {
    return true;
};

function load(that, geoJson, options, sourceUri) {
    let name;
    if (defined(sourceUri)) {
        name = getFilenameFromUri(sourceUri);
    }

    if (defined(name) && that._name !== name) {
        that._name = name;
        that._changed.raiseEvent(that);
    }

    const typeHandler = geoJsonObjectTypes[geoJson.type];
    if (!defined(typeHandler)) {
        throw new RuntimeError(`Unsupported GeoJSON object type: ${geoJson.type}`);
    }

    //Check for a Coordinate Reference System.
    const crs = geoJson.crs;
    let crsFunction = crs !== null ? defaultCrsFunction : null;

    if (defined(crs)) {
        if (!defined(crs.properties)) {
            throw new RuntimeError('crs.properties is undefined.');
        }

        const properties = crs.properties;
        if (crs.type === 'name') {
            crsFunction = crsNames[properties.name];
            if (!defined(crsFunction)) {
                throw new RuntimeError(`Unknown crs name: ${properties.name}`);
            }
        } else if (crs.type === 'link') {
            let handler = crsLinkHrefs[properties.href];
            if (!defined(handler)) {
                handler = crsLinkTypes[properties.type];
            }

            if (!defined(handler)) {
                throw new RuntimeError(`Unable to resolve crs link: ${JSON.stringify(properties)}`);
            }

            crsFunction = handler(properties);
        } else if (crs.type === 'EPSG') {
            crsFunction = crsNames[`EPSG:${properties.code}`];
            if (!defined(crsFunction)) {
                throw new RuntimeError(`Unknown crs EPSG code: ${properties.code}`);
            }
        } else {
            throw new RuntimeError(`Unknown crs type: ${crs.type}`);
        }
    }

    return Promise.resolve(crsFunction).then(function (crsFunction) {
        that._entityCollection.removeAll();

        // null is a valid value for the crs, but means the entire load process becomes a no-op
        // because we can't assume anything about the coordinates.
        if (crsFunction !== null) {
            typeHandler(that, geoJson, geoJson, crsFunction, options);
        }

        return Promise.all(that._promises).then(function () {
            that._promises.length = 0;
            DataSource.setLoading(that, false);
            return that;
        });
    });
}

/**
 * This callback is displayed as part of the PlotDataSource class.
 * @callback PlotDataSource.describe
 * @param {Object} properties The properties of the feature.
 * @param {String} nameProperty The property key that Cesium estimates to have the name of the feature.
 */

export { PlotDataSource };
