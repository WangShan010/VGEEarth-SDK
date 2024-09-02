const esbuild = require('esbuild');

// 生成 2024-01-02 14:25 格式的时间
function getFormatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}`;
}

function addCSSTxt() {
    return `function addLinkStyle() {
                const scriptPath = document.currentScript.src;
                const cssPath = scriptPath.replace('.js','.css');
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = cssPath;
                document.getElementsByTagName("head")[0].appendChild(link);
            };
            addLinkStyle()`;
}

esbuild.context({
    entryPoints: ['./index.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    // 支持的模块格式包括：esm(ES6模块)、cjs(CommonJS)、iife(立即执行函数)、amd(AMD)和umd(UMD)。
    format: 'iife',
    loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.svg': 'dataurl',
        '.woff': 'base64',
        '.woff2': 'base64',
        '.ttf': 'base64',
        '.eot': 'base64',
        '.gif': 'base64'
    },
    // 支持的目标环境包括：es2015(ES6)、es2016(ES7)、es2017(ES8)、es2018(ES9)、es2019(ES10)、es2020(ES11)和esnext(最新版本)。
    target: ['esnext'],
    // 支持的平台包括：browser(浏览器)和node(Node.js)。
    platform: 'browser',
    outfile: `../Demo/Src/LTS-Master/VGEEarth-LTS-min.js`
}).then(ctx => {
    ctx.watch().then(r => {
        console.log('watching...', new Date());
    });
});
