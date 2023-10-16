/****************************************************************************
 名称：用于管理 【Cesium Viewer视图】、【二三维联动 视图】、【鹰眼地图】等 Canvas 容器 Dom 节点的工具类

 最后修改日期：2022-03-10
 ****************************************************************************/

let DomMana = {
    // 初始化根节点
    initRootDom(id: string = 'MapContainer') {
        let root = document.getElementById(id);
        if (root) {
            root.style.cssText = ``;
            root.innerHTML = '';
            root.style.position = 'absolute';
            root.style.height = '100%';
            root.style.width = '100%';
            root.style.display = 'flex';
            root.style.minWidth = '500px';
            root.style.minHeight = '400px';

            let viewer3DDom = document.createElement('div');
            let viewer2DDom = document.createElement('div');
            viewer3DDom.setAttribute('id', 'viewer3DDom');
            viewer2DDom.setAttribute('id', 'viewer2DDom');

            viewer3DDom.style.height = '100%';
            viewer2DDom.style.height = '100%';

            viewer3DDom.style.width = '100%';
            viewer2DDom.style.width = '100%';

            viewer3DDom.style.display = 'inline-block';
            viewer2DDom.style.display = 'none';

            root.appendChild(viewer3DDom);
            root.appendChild(viewer2DDom);
        }
    },

    // 初始化 Cesium 二三维同步
    initCesiumMapLink23d() {
        let viewer2DDom = document.getElementById('viewer2DDom');
        let viewer3DDom = document.getElementById('viewer3DDom');

        if (viewer2DDom) {
            viewer2DDom.style.display = 'inline-block';
            viewer2DDom.style.width = '50%';
        }
        if (viewer3DDom) {
            viewer3DDom.style.display = 'inline-block';
            viewer3DDom.style.width = '50%';
        }
    },
    closeCesiumMapLink23d() {
        let viewer2DDom = document.getElementById('viewer2DDom');
        let viewer3DDom = document.getElementById('viewer3DDom');

        if (viewer2DDom) {
            viewer2DDom.style.display = 'none';
            viewer2DDom.style.width = '100%';
        }
        if (viewer3DDom) {
            viewer3DDom.style.display = 'inline-block';
            viewer3DDom.style.width = '100%';
        }
    },


    // 初始化 ol 二三维同步
    initMapLink23d() {
        let root = document.getElementById('MapContainer');
        let OLContainer = document.getElementById('ol-container');
        let viewer3DDom = document.getElementById('viewer3DDom');

        if (!OLContainer) {
            OLContainer = document.createElement('div');
            OLContainer.id = 'ol-container';
            root && root.appendChild(OLContainer);
        }

        OLContainer.style.cssText = `
            width: 50%;
            height: 100%;
            display: inline-block;
            `;
        // @ts-ignore
        viewer3DDom.style.cssText = `
            width: 50%;
            height: 100%;
            `;
    },
    closeOLMapLink23d() {
        let OLContainer = document.getElementById('ol-container');
        let viewer3DDom = document.getElementById('viewer3DDom');
        if (OLContainer) {
            OLContainer.style.cssText = '';
            OLContainer.style.display = 'none';
        }
        if (viewer3DDom) {
            viewer3DDom.style.width = '100%';
            viewer3DDom.style.display = 'inline-block';
        }
    },

    // 初始化 ol 鹰眼地图
    initOverviewMapDom() {
        let root = document.getElementById('MapContainer');
        let OLContainer = document.getElementById('ol-container');

        if (!OLContainer) {
            OLContainer = document.createElement('div');
            OLContainer.id = 'ol-container';
            root && root.appendChild(OLContainer);
        }

        OLContainer.style.cssText = `
            position: absolute;
            z-index: 99999px;
            bottom: 10px;
            right: 30px;
            height: 160px;
            width: 300px;
            border-radius: 8px;
            padding: 5px;
            border: 2px solid rgba(255, 255, 255, 0.637);`;
        OLContainer.style.display = 'inline';
    },
    closeOverviewMapDom() {
        let OLContainer = document.getElementById('ol-container');
        if (OLContainer) {
            OLContainer.style.display = 'none';
        }
    }

};


export { DomMana };
