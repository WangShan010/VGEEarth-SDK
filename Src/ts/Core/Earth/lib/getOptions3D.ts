function getOptions3D() {
    return {
        animation: false, // 是否显示动画控件
        homeButton: false, // 是否显示home键
        geocoder: false, // 是否显示地名查找控件
        baseLayerPicker: false, // 是否显示图层选择控件
        timeline: false, // 是否显示时间线控件
        fullscreenButton: false, // 是否全屏显示
        scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        infoBox: true, // 是否显示点击要素之后显示的信息
        sceneModePicker: false, // 是否显示投影方式控件  三维/二维
        navigationInstructionsInitiallyVisible: false,
        navigationHelpButton: false, // 是否显示帮助信息控件
        selectionIndicator: false, // 是否显示指示器组件
        vrButton: false, // VR 按钮，这个功能需要屏幕【硬件】支持
        orderIndependentTranslucency: false,    // 如果为 true 并且配置支持它，请使用与顺序无关的半透明。
        shadows: false, // true时，地表透明会引起变暗，并闪烁??
        shouldAnimate: true,
        imageryProvider: false,
        contextOptions: {
            webgl: {
                requestWebgl2: true,
                alpha: true,
                preserveDrawingBuffer: true // 通过canvas.toDataURL()实现截图需要将该项设置为true
            }
        }
    };
}

export { getOptions3D };
