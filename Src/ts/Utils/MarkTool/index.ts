class MarkTool {
    private imgUrl: string;
    private mv: HTMLImageElement;

    constructor(imgUrl: string) {
        this.imgUrl = imgUrl;

        let mv = document.createElement('img');
        this.mv = mv;
        mv.src = this.imgUrl;
        mv.style.position = 'absolute';
        mv.style.left = '-100px';
        mv.style.top = '-100px';
        document.body.append(mv);

        document.onmousemove = function (e) {
            e = e || window.event;
            mv.style.left = e.clientX - mv.width / 2 + 'px';
            mv.style.top = e.clientY - mv.height + 'px';
        };
    }

    remove() {
        document.onmousemove = null;
        document.body.removeChild(this.mv);
    }
}

export { MarkTool };
