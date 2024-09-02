function blobToImg(blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            let img = new Image();
            img.src = reader.result;
            img.addEventListener('load', () => resolve(img));
        });
        reader.readAsDataURL(blob);
    });
}
function imgToCanvas(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
}
function waterMark(canvas, text) {
    return new Promise(async (resolve, reject) => {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255,255,255,0.34)';
        ctx.fillRect(canvas.width / 2 - 300, 10, 600, 40);
        // 设置填充字号和字体，样式
        ctx.font = '30px 宋体';
        ctx.fillStyle = 'rgb(5,28,67)';
        // ctx.backgroundColor = 'rgba(255,255,255,0.75)';
        // 设置右对齐
        ctx.textAlign = 'center';
        // 在指定位置绘制文字，这里指定距离右下角 20 坐标的地方
        ctx.fillText(text, canvas.width / 2, 45);
        canvas.toBlob(async (blob) => {
            blob && blobToImg(blob).then((img) => {
                let canvas = imgToCanvas(img);
                resolve(canvas);
            });
        });
    });
}
export { waterMark };
