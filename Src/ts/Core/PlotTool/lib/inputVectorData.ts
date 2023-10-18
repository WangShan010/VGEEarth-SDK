function inputVectorData({errFunc, endFunc} = {errFunc: Function, endFunc: Function}) {
    document.getElementById('_ef')?.remove();

    let inputObj = document.createElement('input');
    inputObj.setAttribute('id', '_ef');
    inputObj.setAttribute('type', 'file');
    inputObj.setAttribute('style', 'display:none');
    document.body.appendChild(inputObj);
    inputObj.onchange = function () {
        // @ts-ignore
        let file = inputObj.files[0];
        let fileName = file.name;
        let filePath = inputObj.value;
        let fileType = getFileType(fileName);
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        if (!fileType) {
            errFunc && errFunc('文件类型无法失败，只支持kml、GeoJson格式');
            return;
        }

        if (fileType === 'geoJson') {
            reader.onload = function (evt: any) {
                try {
                    let geoJson = JSON.parse(evt.target.result);
                    // @ts-ignore
                    endFunc && endFunc({fileName, filePath, fileType, geoJson});
                } catch (e) {
                    console.log(e);
                    errFunc && errFunc('文件已损坏');
                }
            };
        } else if (fileType === 'kml') {
            reader.onload = function (evt: any) {
                let domParser = new DOMParser();
                try {
                    let kmlStr = domParser.parseFromString(evt.target.result, 'text/xml');
                    let geoJson = window.toGeoJSON.kml(kmlStr);
                    if (geoJson.features.length === 0) {
                        console.log('数据为空：', geoJson);
                        errFunc && errFunc('文件已损坏');
                        return;
                    }
                    // @ts-ignore
                    typeof endFunc === 'function' && endFunc({fileName, filePath, fileType, geoJson});
                } catch (e) {
                    errFunc && errFunc('文件已损坏');
                }
            };
        }

    };
    inputObj.click();
}

function getFileType(fileName: string) {
    let type = '';

    fileName = fileName.toLowerCase();
    type = fileName.indexOf('on') > -1 ? 'geoJson' : type;
    type = fileName.indexOf('.geojson') > -1 ? 'geoJson' : type;
    type = fileName.indexOf('.xml') > -1 ? 'kml' : type;
    type = fileName.indexOf('.kml') > -1 ? 'kml' : type;

    return type;
}

export { inputVectorData };
