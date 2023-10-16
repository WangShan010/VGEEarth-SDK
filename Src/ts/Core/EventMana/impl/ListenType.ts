export enum ConfigEventType {
    addData
}

export enum ViewerEventType {
    init,
    hide,
    show,
    destroy
}

export enum ScreenSpaceEventType {
    LEFT_DOWN = 0,
    LEFT_UP = 1,
    LEFT_CLICK = 2,
    LEFT_DOUBLE_CLICK = 3,
    RIGHT_DOWN = 5,
    RIGHT_UP = 6,
    RIGHT_CLICK = 7,
    MIDDLE_DOWN = 10,
    MIDDLE_UP = 11,
    MIDDLE_CLICK = 12,
    MOUSE_MOVE = 15,
    WHEEL = 16,
    PINCH_START = 17,
    PINCH_END = 18,
    PINCH_MOVE = 19
}

export enum CameraEventType {
    LEFT_DRAG = 0,
    RIGHT_DRAG = 1,
    MIDDLE_DRAG = 2,
    WHEEL = 3,
    PINCH = 4
}

export enum DataEventType {
    addData,        // 数据新增
    removeData,     // 数据移除
    changedData     // 数据发生改变之后发生
}