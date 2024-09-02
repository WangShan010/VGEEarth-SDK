import {ResourceItem} from '../../Config/ResourceItem/ResourceItem'


import {ImageryLayer, ImageryProvider, Viewer} from 'cesium'
import {Cesium} from '../../Impl/Declare'
import {VGEData} from './impl/VGEData'
import {LayerSchemeEnum} from '../../Config/Enum/LayerSchemeEnum'
import {SceneUtils} from '../../../Utils/SceneUtils/index'

class VGELayer extends VGEData<ImageryLayer> {

	constructor(viewer: Viewer) {
		super(viewer)
	}

	async addData(resourceItem: ResourceItem): Promise<any> {
		const prop = resourceItem.properties
		const url = prop.url
		let layer = null

		switch (prop.scheme) {
			case LayerSchemeEnum['layer-wms']:
				layer = this.addWebMapTileServiceImageryProvider(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-tms']:
				layer = this.addImageryXYZ_TMS_Provider(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-wmts']:
				layer = this.addWebMapTileServiceImageryProvider(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-singleTileImagery']:
				layer = this.addSingleTileImagery(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-xyz-3857']:
				layer = this.addImageryXYZ_3857_Provider(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-xyz-4326']:
				layer = this.addImageryXYZ_4326_Provider(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-arcgisMapServer']:
				layer = this.addArcGisMapServerImagery(url, resourceItem)
				break
			case  LayerSchemeEnum['layer-geoserver']:
				layer = this.addGeoserverWMS(url, resourceItem)
				break
			case  LayerSchemeEnum['IonImageryProvider']: {
				const img = await Cesium.IonImageryProvider.fromAssetId(resourceItem.properties.assetId)
				layer = this.addImageryProvider(img, resourceItem)
				break
			}
			case  LayerSchemeEnum['WebMercatorTilingScheme2x2']:
				layer = this.addImageryWebMercatorTilingScheme2x2_Provider(url, resourceItem)
				break
			default: {
				console.log('数据项，缺少图层类型标识符', prop)
				return null
			}
		}

		return layer
	}


	async flyToByPid(pid: string): Promise<boolean> {
		const sourcesItem = this.getSourcesItemsByPid(pid)
		if (!sourcesItem) return false

		const r = sourcesItem?.properties?.rectangle

		if (r) {
			return new Promise(() => {
				this.viewer.camera.flyTo({
					destination: Cesium.Rectangle.fromDegrees(r.west, r.south, r.east, r.north)
				})
			})
		} else {
			return await SceneUtils.viewerFlyToLonLat(110, 40, 15000000)
		}
	}

	removeByPid(pid: string): boolean {
		let removeRes = false
		const instance = this.getInstancesByPid(pid)
		this.sourcesItems = this.sourcesItems.filter(item => item.pid !== pid)

		if (instance) {
			removeRes = this.viewer.imageryLayers.remove(instance)
			if (!instance.isDestroyed()) {
				instance.destroy()
			}
			this.instancesMap.delete(pid)

		}
		return removeRes
	}


	addSingleTileImagery(url: string, param: ResourceItem) {
		url = url || require('../../../../img/earth/worldimage2.png')
		let layerRectangle = param.properties.layerRectangle
		if (Array.isArray(layerRectangle)) {
			layerRectangle = Cesium.Rectangle.fromDegrees(...layerRectangle)
		} else {
			layerRectangle = Cesium.Rectangle.MAX_VALUE
		}

		const paramDefault = {
			url: url,
			rectangle: layerRectangle,
			tileWidth: param.properties.tileWidth || 256,
			tileHeight: param.properties.tileHeight || 256
		}

		return this.addImageryProvider(new Cesium.SingleTileImageryProvider({
			...paramDefault,
			...param.properties
		}), param)
	}

	// 添加 wmts 服务的地图
	addWebMapTileServiceImageryProvider(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})
		const paramDefault = {
			layer: '',
			style: '',
			tileMatrixSetID: '',
			url: resource,
			format: 'image/jpeg'
		}
		const provider = new Cesium.WebMapTileServiceImageryProvider({
			...paramDefault,
			...param.properties
		})
		return this.addImageryProvider(provider, param)
	}

	addImageryXYZ_TMS_Provider(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})
		const paramDefault = {
			url: resource,
			show: param.show || true,
			minimumLevel: param.properties.minimumLevel || 0,
			maximumLevel: param.properties.maximumLevel || 22
		}
		const imageryProvider = new Cesium.TileMapServiceImageryProvider({
			...paramDefault,
			...param.properties
		})

		return this.addImageryProvider(imageryProvider, param)
	}


	addImageryXYZ_3857_Provider(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})

		let rectangle = Cesium.Rectangle.MAX_VALUE

		function angleToRadian(angle: number) {
			return angle * Math.PI / 180
		}

		if (param.properties.rectangle) {
			rectangle = new Cesium.Rectangle(
				angleToRadian(param.properties.rectangle.west),
				angleToRadian(param.properties.rectangle.south),
				angleToRadian(param.properties.rectangle.east),
				angleToRadian(param.properties.rectangle.north)
			)
		}

		const imageryProvider = new Cesium.UrlTemplateImageryProvider({
			...param.properties,
			url: resource,
			show: param.show || true,
			tilingScheme: new Cesium.WebMercatorTilingScheme(),
			rectangle: rectangle
		})

		return this.addImageryProvider(imageryProvider, param)
	}

	addImageryWebMercatorTilingScheme2x2_Provider(url: string, param: ResourceItem) {
		const imageryProvider = new Cesium.UrlTemplateImageryProvider({
			...param.properties,
			url: url,
			tilingScheme: new Cesium.WebMercatorTilingScheme({
				numberOfLevelZeroTilesX: 2,
				numberOfLevelZeroTilesY: 2
			})
		})
		return this.addImageryProvider(imageryProvider, param)
	}

	addImageryXYZ_4326_Provider(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})
		const imageryProvider = new Cesium.UrlTemplateImageryProvider({
			...param.properties,
			url: resource,
			show: param.show || true,
			tilingScheme: new Cesium.GeographicTilingScheme({
				numberOfLevelZeroTilesX: 2,
				numberOfLevelZeroTilesY: 1
			}),
			minimumLevel: param.properties.minimumLevel || 0,
			maximumLevel: param.properties.maximumLevel || 22
		})
		return this.addImageryProvider(imageryProvider, param)
	}

	// 添加 ArcGisMapServerImagery 的服务
	addArcGisMapServerImagery(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})
		const provider = new Cesium.ArcGisMapServerImageryProvider({
			url: resource,
			show: param.show || true,
			enablePickFeatures: false
		})

		return this.addImageryProvider(provider, param)
	}

	// 添加 geoserver 的 wms 服务
	addGeoserverWMS(url: string, param: ResourceItem) {
		const queryParameters = param.properties.queryParameters || {}
		const resource = new Cesium.Resource({url, queryParameters})
		const provider = new Cesium.WebMapServiceImageryProvider({
			url: resource,
			show: param.show || true,
			layers: param.properties.layers,
			parameters: {
				service: 'WMS',
				format: 'image/png',
				transparent: true
			}
		})
		return this.addImageryProvider(provider, param)
	}

	addImageryProvider(provider: ImageryProvider, resourceItem: ResourceItem) {
		const layer = this.viewer.imageryLayers.addImageryProvider(provider)
		if (layer) {
			// @ts-ignore
			layer.pid = resourceItem.pid
			// @ts-ignore
			layer.param = resourceItem
			// 如果该图层是底图，则把该图层降到最底层
			if (resourceItem.properties.baseLayer) {
				this.viewer.imageryLayers.lowerToBottom(layer)
			}
			this.instancesMap.set(resourceItem.pid, layer)
			this.sourcesItems.push(resourceItem)
		}

		return layer
	}

	destroy(): boolean {
		return this.removeAll()
	}
}


function getLevel(height: number) {
	if (height > 48000000) {
		return 0
	} else if (height > 24000000) {
		return 1
	} else if (height > 12000000) {
		return 2
	} else if (height > 6000000) {
		return 3
	} else if (height > 3000000) {
		return 4
	} else if (height > 1500000) {
		return 5
	} else if (height > 750000) {
		return 6
	} else if (height > 375000) {
		return 7
	} else if (height > 187500) {
		return 8
	} else if (height > 93750) {
		return 9
	} else if (height > 46875) {
		return 10
	} else if (height > 23437.5) {
		return 11
	} else if (height > 11718.75) {
		return 12
	} else if (height > 5859.38) {
		return 13
	} else if (height > 2929.69) {
		return 14
	} else if (height > 1464.84) {
		return 15
	} else if (height > 732.42) {
		return 16
	} else if (height > 366.21) {
		return 17
	} else {
		return 18
	}
}

function getSpace(level: number) {
	if (level > 16) {
		level = 16
	}
	return 40075020 / (Math.pow(2, level)) / 64
}

export {VGELayer}
