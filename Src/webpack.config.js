const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const time = new Date().getTime();
const fs = require('fs');

function createDirectory(path) {
    const dirCache = {};
    const arr = path.replace(/\\/g, '/').split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
}

function createFile(filePath, data) {
    let dirPath = path.dirname(filePath) + '\\';

    createDirectory(dirPath);
    if (fs.existsSync(filePath)) {
        // console.warn('文件已存在');
    } else {
        fs.writeFileSync(filePath, data);
    }
}

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

createFile(
    path.resolve(__dirname, `../Demo/Src/LTS-Master/版本说明.txt`),
    `编译时间：${getFormatDate()}，可免费试用至 2024-09-01`,
    'utf8'
);

// 打包全部的
let all = {
    mode: 'production',
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, `../Demo/Src/LTS-Master`),
        filename: `VGEEarth-LTS-min.js`
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    name: './[path][name].[ext]',
                    limit: 1024 * 80,
                    esModule: false
                },
                type: 'javascript/auto'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    name: './[path][name].[ext]',
                    limit: 1024 * 80,
                    esModule: false
                },
                type: 'javascript/auto'
            },
            {
                test: /\.(glb|gltf)$/,
                loader: 'url-loader',
                options: {
                    name: './[path][name].[ext]',
                    limit: false,
                    esModule: false
                },
                type: 'javascript/auto'
            },
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    // 这段代码可以不对 SDK 进行加密。
    // 调试时：可以把它解开注释，如果注释这段代码，打包调试会比较慢
    // 编译为发行版时：需要将 SDK 编译为加密发行版，给其他人使用，此时【必须要将它注释】
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             include: /\.min\.js$/
    //         })
    //     ]
    // },
    watch: true   // 监听修改自动打包
};

module.exports = all;


