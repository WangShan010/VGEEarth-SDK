import { Cesium } from '../../Impl/Declare';
import { Cartesian3, Viewer } from 'cesium';

class dragEntity {

    private leftDownFlag: boolean;
    private pointDraged: any;
    private viewer: Viewer;
    private handler: any;
    private cartesian: any;
    private startPoint: any;
    private polylinePreviousCoordinates: Cartesian3[] = [];
    private polygonPreviousCoordinates: { positions: Cartesian3[] } = {positions: []};
    private rectanglePreviousCoordinates: any;
    private MoveEntity: any;
    private _moveEndCallBack: any;


    constructor(_moveEndCallBack: any, options: any) {
        this.leftDownFlag = false;
        // this.pointDraged= viewer.scene.pick(movement.position);
        this.viewer = options.viewer;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.cartesian = null;
        this.startPoint = null;
        this.rectanglePreviousCoordinates = {};
        this.Init();
    }

    Init() {
        // Select plane when mouse down
        let that = this;
        this.handler.setInputAction(function (movement: any) {
            that.pointDraged = that.viewer.scene.pick(movement.position); //选取当前的entity
            that.leftDownFlag = true;
            if (that.pointDraged && that.pointDraged.id) {
                //记录按下去的坐标
                that.startPoint = that.viewer.scene.pickPosition(movement.position);
                that.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
                //当前实体Entity的polyline坐标属性信息暂存
                if (that.pointDraged.id.polyline) {
                    that.polylinePreviousCoordinates = that.pointDraged.id.polyline.positions.getValue();
                }
                if (that.pointDraged.id.polygon) {
                    that.polygonPreviousCoordinates = that.pointDraged.id.polygon.hierarchy.getValue();
                }
                if (that.pointDraged.id.rectangle) {
                    that.rectanglePreviousCoordinates = that.pointDraged.id.rectangle.coordinates.getValue();
                }
            } else {
                that.leftDownFlag = false;
                that.pointDraged = null;
                that.viewer.scene.screenSpaceCameraController.enableInputs = true;
                that.viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
                that.handler.destroy();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Release plane on mouse up
        this.handler.setInputAction(function () {
            if (that._moveEndCallBack) {
                that._moveEndCallBack({
                    entityId: that.pointDraged.id.id,
                    startPosition: that.startPoint,
                    endPosition: that.cartesian ? that.cartesian : that.startPoint
                });
            }
            that.leftDownFlag = false;
            that.pointDraged = null;
            that.viewer.scene.screenSpaceCameraController.enableInputs = true;
            that.viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
            that.handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        // Update plane on mouse move
        this.handler.setInputAction((movement: any) => {
            if (that.leftDownFlag === true && that.pointDraged != null && that.pointDraged.id) {
                //记录尾随的坐标
                let startPosition = that.viewer.scene.pickPosition(movement.startPosition);
                let endPosition = that.viewer.scene.pickPosition(movement.endPosition);

                if (Cesium.defined(startPosition) && Cesium.defined(endPosition)) {
                    that.pointDraged.id.position = new Cesium.CallbackProperty(function () {
                        return endPosition;
                    }, false);
                    //防止闪烁，在移动的过程console.log(pointDraged.id);
                    //计算每次的偏差
                    let changed_x = endPosition.x - startPosition.x;
                    let changed_y = endPosition.y - startPosition.y;
                    let changed_z = endPosition.z - startPosition.z;

                    that.cartesian = endPosition;

                    if (that.pointDraged.id.polyline) {
                        let currentsPoint: Cartesian3[] = [];
                        for (let i = 0; i < that.polylinePreviousCoordinates.length; i++) {
                            //与之前的算差 替换掉
                            that.polylinePreviousCoordinates[i].x =
                                that.polylinePreviousCoordinates[i].x + changed_x;
                            that.polylinePreviousCoordinates[i].y =
                                that.polylinePreviousCoordinates[i].y + changed_y;
                            that.polylinePreviousCoordinates[i].z =
                                that.polylinePreviousCoordinates[i].z + changed_z;
                            currentsPoint.push(that.polylinePreviousCoordinates[i]);
                        }
                        that.pointDraged.id.polyline.positions = new Cesium.CallbackProperty(
                            () => currentsPoint,
                            false
                        );
                    }

                    if (that.pointDraged.id.polygon) {
                        let currentsPoint: Cartesian3[] = [];
                        for (
                            let i = 0;
                            i < that.polygonPreviousCoordinates.positions.length;
                            i++
                        ) {
                            that.polygonPreviousCoordinates.positions[i].x += changed_x;
                            that.polygonPreviousCoordinates.positions[i].y += changed_y;
                            that.polygonPreviousCoordinates.positions[i].z += changed_z;
                            currentsPoint.push(that.polygonPreviousCoordinates.positions[i]);
                        }
                        that.pointDraged.id.polygon.hierarchy = new Cesium.CallbackProperty(
                            function () {
                                return {positions: currentsPoint, holes: []};
                            },
                            false
                        );
                    }

                    if (that.pointDraged.id.rectangle) {
                        let storePoint = {};

                        let position_start = startPosition;
                        let cartographic_start = Cesium.Cartographic.fromCartesian(
                            position_start
                        );
                        let longitude_start = Cesium.Math.toDegrees(
                            cartographic_start.longitude
                        );
                        let latitude_start = Cesium.Math.toDegrees(
                            cartographic_start.latitude
                        );
                        let height_start = cartographic_start.height;

                        let position_end = endPosition;
                        let cartographic_end = Cesium.Cartographic.fromCartesian(
                            position_end
                        );
                        let longitude_end = Cesium.Math.toDegrees(
                            cartographic_end.longitude
                        );
                        let latitude_end = Cesium.Math.toDegrees(
                            cartographic_end.latitude
                        );
                        let height_end = cartographic_end.height;

                        let changer_lng = longitude_end - longitude_start;
                        let changer_lat = latitude_end - latitude_start;

                        that.rectanglePreviousCoordinates.west = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(that.rectanglePreviousCoordinates.west) +
                            changer_lng
                        );

                        that.rectanglePreviousCoordinates.east = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(that.rectanglePreviousCoordinates.east) +
                            changer_lng
                        );

                        that.rectanglePreviousCoordinates.south = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(that.rectanglePreviousCoordinates.south) +
                            changer_lat
                        );
                        that.rectanglePreviousCoordinates.north = Cesium.Math.toRadians(
                            Cesium.Math.toDegrees(that.rectanglePreviousCoordinates.north) +
                            changer_lat
                        );
                        storePoint = that.rectanglePreviousCoordinates;

                        that.pointDraged.id.rectangle.coordinates = new Cesium.CallbackProperty(
                            function () {
                                // storePoint=new Cesium.Rectangle.fromDegrees(storePoint.west,storePoint.south,storePoint.east,storePoint.north);

                                return storePoint;
                                // return Cesium.Rectangle.fromDegrees(rectanglePreviousCoordinates.west, rectanglePreviousCoordinates.south, rectanglePreviousCoordinates.east, rectanglePreviousCoordinates.north);
                            },
                            false
                        );
                        that.pointDraged.id.rectangle.height = new Cesium.CallbackProperty(
                            function () {
                                return height_end;
                            },
                            false
                        );
                    }

                    if (that.pointDraged.id.ellipse) {
                        let position_end = endPosition;
                        let cartographic_end = Cesium.Cartographic.fromCartesian(
                            position_end
                        );
                        let height_end = cartographic_end.height;
                        this.pointDraged.id.ellipse.height = new Cesium.CallbackProperty(
                            function () {
                                return height_end;
                            },
                            false
                        );
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}


// function dragEntity(_view: Viewer, _moveEndCallBack:Function) {
//     let MoveEntity = (function () {
//             let leftDownFlag = false;
//             let pointDraged= null;
//             let viewer;
//             let handler, cartesian;
//             let startPoint;
//             let polylinePreviousCoordinates;
//             let polygonPreviousCoordinates;
//             let rectanglePreviousCoordinates = {};
//
//             function ConstructMoveEntity(options, _moveEndCallBack) {
//                 viewer = options.viewer;
//                 handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//                 Init();
//             }
//
//             function Init() {
//                 // Select plane when mouse down
//                 handler.setInputAction(function (movement) {
//                     pointDraged = viewer.scene.pick(movement.position); //选取当前的entity
//                     leftDownFlag = true;
//                     if (pointDraged && pointDraged.id) {
//                         //记录按下去的坐标
//                         startPoint = viewer.scene.pickPosition(movement.position);
//                         viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
//                         //当前实体Entity的polyline坐标属性信息暂存
//                         if (pointDraged.id.polyline) {
//                             polylinePreviousCoordinates = pointDraged.id.polyline.positions.getValue();
//                         }
//                         if (pointDraged.id.polygon) {
//                             polygonPreviousCoordinates = pointDraged.id.polygon.hierarchy.getValue();
//                         }
//                         if (pointDraged.id.rectangle) {
//                             rectanglePreviousCoordinates = pointDraged.id.rectangle.coordinates.getValue();
//                         }
//                     } else {
//                         leftDownFlag = false;
//                         pointDraged = null;
//                         viewer.scene.screenSpaceCameraController.enableInputs = true;
//                         viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
//                         handler.destroy();
//                     }
//                 }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
//
//                 // Release plane on mouse up
//                 handler.setInputAction(function () {
//                     if (_moveEndCallBack) {
//                         _moveEndCallBack({
//                             entityId: pointDraged.id.id,
//                             startPosition: startPoint,
//                             endPosition: cartesian ? cartesian : startPoint
//                         });
//                     }
//                     leftDownFlag = false;
//                     pointDraged = null;
//                     viewer.scene.screenSpaceCameraController.enableInputs = true;
//                     viewer.scene.screenSpaceCameraController.enableRotate = true; //锁定相机
//                     handler.destroy();
//                 }, Cesium.ScreenSpaceEventType.LEFT_UP);
//
//                 // Update plane on mouse move
//                 handler.setInputAction(function (movement) {
//                     if (leftDownFlag === true && pointDraged != null && pointDraged.id) {
//                         //记录尾随的坐标
//                         let startPosition = viewer.scene.pickPosition(movement.startPosition);
//                         let endPosition = viewer.scene.pickPosition(movement.endPosition);
//
//                         if (Cesium.defined(startPosition) && Cesium.defined(endPosition)) {
//                             pointDraged.id.position = new Cesium.CallbackProperty(function () {
//                                 return endPosition;
//                             }, false);
//                             //防止闪烁，在移动的过程console.log(pointDraged.id);
//                             //计算每次的偏差
//                             let changed_x = endPosition.x - startPosition.x;
//                             let changed_y = endPosition.y - startPosition.y;
//                             let changed_z = endPosition.z - startPosition.z;
//
//                             cartesian = endPosition;
//
//                             if (pointDraged.id.polyline) {
//                                 let currentsPoint = [];
//                                 for (let i = 0; i < polylinePreviousCoordinates.length; i++) {
//                                     //与之前的算差 替换掉
//                                     polylinePreviousCoordinates[i].x =
//                                         polylinePreviousCoordinates[i].x + changed_x;
//                                     polylinePreviousCoordinates[i].y =
//                                         polylinePreviousCoordinates[i].y + changed_y;
//                                     polylinePreviousCoordinates[i].z =
//                                         polylinePreviousCoordinates[i].z + changed_z;
//                                     currentsPoint.push(polylinePreviousCoordinates[i]);
//                                 }
//                                 pointDraged.id.polyline.positions = new Cesium.CallbackProperty(
//                                     function () {
//                                         return currentsPoint;
//                                     },
//                                     false
//                                 );
//                             }
//
//                             if (pointDraged.id.polygon) {
//                                 let currentsPoint = [];
//                                 for (
//                                     let i = 0;
//                                     i < polygonPreviousCoordinates.positions.length;
//                                     i++
//                                 ) {
//                                     polygonPreviousCoordinates.positions[i].x =
//                                         polygonPreviousCoordinates.positions[i].x + changed_x;
//                                     polygonPreviousCoordinates.positions[i].y =
//                                         polygonPreviousCoordinates.positions[i].y + changed_y;
//                                     polygonPreviousCoordinates.positions[i].z =
//                                         polygonPreviousCoordinates.positions[i].z + changed_z;
//                                     currentsPoint.push(polygonPreviousCoordinates.positions[i]);
//                                 }
//                                 pointDraged.id.polygon.hierarchy = new Cesium.CallbackProperty(
//                                     function () {
//                                         return {positions: currentsPoint, holes: []};
//                                     },
//                                     false
//                                 );
//                             }
//
//                             if (pointDraged.id.rectangle) {
//                                 let storePoint = {};
//
//                                 let position_start = startPosition;
//                                 let cartographic_start = Cesium.Cartographic.fromCartesian(
//                                     position_start
//                                 );
//                                 let longitude_start = Cesium.Math.toDegrees(
//                                     cartographic_start.longitude
//                                 );
//                                 let latitude_start = Cesium.Math.toDegrees(
//                                     cartographic_start.latitude
//                                 );
//                                 let height_start = cartographic_start.height;
//
//                                 let position_end = endPosition;
//                                 let cartographic_end = Cesium.Cartographic.fromCartesian(
//                                     position_end
//                                 );
//                                 let longitude_end = Cesium.Math.toDegrees(
//                                     cartographic_end.longitude
//                                 );
//                                 let latitude_end = Cesium.Math.toDegrees(
//                                     cartographic_end.latitude
//                                 );
//                                 let height_end = cartographic_end.height;
//
//                                 let changer_lng = longitude_end - longitude_start;
//                                 let changer_lat = latitude_end - latitude_start;
//
//                                 rectanglePreviousCoordinates.west = Cesium.Math.toRadians(
//                                     Cesium.Math.toDegrees(rectanglePreviousCoordinates.west) +
//                                     changer_lng
//                                 );
//
//                                 rectanglePreviousCoordinates.east = Cesium.Math.toRadians(
//                                     Cesium.Math.toDegrees(rectanglePreviousCoordinates.east) +
//                                     changer_lng
//                                 );
//
//                                 rectanglePreviousCoordinates.south = Cesium.Math.toRadians(
//                                     Cesium.Math.toDegrees(rectanglePreviousCoordinates.south) +
//                                     changer_lat
//                                 );
//                                 rectanglePreviousCoordinates.north = Cesium.Math.toRadians(
//                                     Cesium.Math.toDegrees(rectanglePreviousCoordinates.north) +
//                                     changer_lat
//                                 );
//                                 storePoint = rectanglePreviousCoordinates;
//
//                                 pointDraged.id.rectangle.coordinates = new Cesium.CallbackProperty(
//                                     function () {
//                                         // storePoint=new Cesium.Rectangle.fromDegrees(storePoint.west,storePoint.south,storePoint.east,storePoint.north);
//
//                                         return storePoint;
//                                         // return Cesium.Rectangle.fromDegrees(rectanglePreviousCoordinates.west, rectanglePreviousCoordinates.south, rectanglePreviousCoordinates.east, rectanglePreviousCoordinates.north);
//                                     },
//                                     false
//                                 );
//                                 pointDraged.id.rectangle.height = new Cesium.CallbackProperty(
//                                     function () {
//                                         return height_end;
//                                     },
//                                     false
//                                 );
//                             }
//
//                             if (pointDraged.id.ellipse) {
//                                 let position_end = endPosition;
//                                 let cartographic_end = Cesium.Cartographic.fromCartesian(
//                                     position_end
//                                 );
//                                 let height_end = cartographic_end.height;
//                                 pointDraged.id.ellipse.height = new Cesium.CallbackProperty(
//                                     function () {
//                                         return height_end;
//                                     },
//                                     false
//                                 );
//                             }
//                         }
//                     }
//                 }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//             }
//
//             return ConstructMoveEntity;
//         })();
//         MoveEntity({viewer: _view}, _moveEndCallBack);
//     }


export { dragEntity };
