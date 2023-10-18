const earth = new VGEEarth.Earth('MapContainer');


// 生成快照
const convertToImage = (container, options = {}) => {
    // 设置放大倍数
    const scale = window.devicePixelRatio;

    // 传入节点原始宽高
    const _width = container.offsetWidth;
    const _height = container.offsetHeight;

    let { width, height } = options;
    width = width || _width;
    height = height || _height;

    // html2canvas配置项
    const ops = {
        scale, // width,
        // height,
        useCORS: true, allowTaint: false, ...options
    };

    return html2canvas(container, ops).then(canvas => {
        // 返回图片的二进制数据
        return canvas.toDataURL('image/png');
    });
};

// 调用函数，取到截图的二进制数据，对图片进行处理（保存本地、展示等）

window.print = async function () {
    let d = document.body;
    const imgBlobData = await convertToImage(d);
    saveAs(imgBlobData, 'test.png');
};
