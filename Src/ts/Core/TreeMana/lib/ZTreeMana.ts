/****************************************************************************
 名称：资源树状图控件
 描述：基于 zTree -- jQuery 树插件，生成资源树状图控件

 最后修改日期：2022-08-02
 ****************************************************************************/

import { Viewer } from 'cesium';
import * as ListenType from '../../../Core/EventMana/impl/ListenType';
import { ConfigTool } from '../../../Core/Config/ConfigTool';
import { arrGrouping } from './arrGrouping';
import { EventMana } from '../../../Core/EventMana/EventMana';
import { getEarth } from '../../../Core/Earth/lib/getEarth';
import { ScopeType } from '../../../Core/EventMana/impl/ScopeType';
import { WorkSpace } from '../../../Core/WorkSpace/index';
import { toFirst } from './toFirst';


class ZTreeMana {
    private viewer: Viewer;
    scopeType: ScopeType;
    customOption: any;
    treeNodes: ITreeNode[];
    workSpace: WorkSpace;

    constructor(viewer: Viewer, scopeType: ScopeType = ScopeType.Viewer3D, customOption = {}) {
        this.viewer = viewer;
        this.scopeType = scopeType;
        this.customOption = customOption;
        this.workSpace = <WorkSpace>(scopeType === ScopeType.Viewer3D ? getEarth().viewer3DWorkSpace : getEarth().viewer2DWorkSpace);

        this.treeNodes = this.getTreeNodeByConfig();
        // @ts-ignore
        $.fn.zTree.init($('#treeDom'), this.getSetting(), this.treeNodes);


        this.initEvent();
        this.treeNodes = this.reFreshTreeNodeByWorkSpace();
        // @ts-ignore
        $.fn.zTree.init($('#treeDom'), this.getSetting(), this.treeNodes);

    }

    // 初始化资源 【载入、移除】事件
    initEvent() {
        let that = this;
        EventMana.sourceEvent.addEventListener(
            ListenType.DataEventType.addData,
            ScopeType.Viewer3D,
            () => {
                that.treeNodes = that.reFreshTreeNodeByWorkSpace();
                // @ts-ignore
                $.fn.zTree.init($('#treeDom'), this.getSetting(), that.treeNodes);
            }
        );
        EventMana.sourceEvent.addEventListener(
            ListenType.DataEventType.removeData,
            ScopeType.Viewer3D,
            () => {
                that.treeNodes = that.reFreshTreeNodeByWorkSpace();
                // @ts-ignore
                $.fn.zTree.init($('#treeDom'), this.getSetting(), that.treeNodes);
            }
        );
    }

    // 根据 ConfigTool 的配置信息，初始化树的节点
    getTreeNodeByConfig() {
        let treeNodes = [];
        // 获取配置文件中全部的资源
        let configList = ConfigTool.getAllSources();
        configList = configList.filter((item: any) => item.showInTree);
        // 对数据列表进行分组
        let nodeGroupArr = arrGrouping(configList, 'catalog') as any[];
        let firstGroup = ['基础影像', '电子地图', '地形图层'];

        for (let i = 0; i < firstGroup.length; i++) {
            for (let j = 0; j < nodeGroupArr.length; j++) {
                let items = nodeGroupArr[j] as any;
                if (firstGroup[i] === items[0]['catalog']) {
                    nodeGroupArr = toFirst(nodeGroupArr, j);
                }
            }
        }


        for (let i = 0; i < nodeGroupArr.length; i++) {
            let items = nodeGroupArr[i] as any;

            let root = {
                name: items[0]['catalog'],
                open: false,
                children: [],
                checked: false,
                font: this.customOption.font
            };
            root = {...root, ...this.customOption};
            items.forEach((item: any) => {
                let icon = null;
                if (item.dataType === 'layer') {
                    icon = require('../../../../img/tree/图层.png');
                } else if (item.dataType === 'terrain') {
                    icon = require('../../../../img/tree/地形.png');
                } else if (item.dataType === '3DTiles') {
                    icon = require('../../../../img/tree/倾斜摄影.png');
                } else if (item.dataType === 'gltf') {
                    icon = require('../../../../img/tree/模型.png');
                } else if (item.dataType === 'poi') {
                    icon = require('../../../../img/tree/点.png');
                } else if (item.dataType === 'geoJson') {
                    icon = require('../../../../img/tree/geoJson.png');
                }
                let i = {
                    id: item.pid,
                    name: item.name,
                    checked: false,
                    nodeData: item,
                    icon,
                    font: this.customOption.font
                };
                i = {...i, ...this.customOption};
                // @ts-ignore
                root.children.push(i);
            });
            treeNodes.push(root);
        }


        return treeNodes;
    }


    // 根据工作区的配置，对树节点的 勾选状态 进行刷新
    reFreshTreeNodeByWorkSpace() {
        // @ts-ignore
        let treeNodes = $.fn.zTree.getZTreeObj('treeDom').getNodes();

        for (let i = 0; i < treeNodes.length; i++) {
            let groupNode = treeNodes[i];
            let allCheck = true;

            for (let j = 0; j < groupNode.children.length; j++) {
                let nodeItem = groupNode.children[j];
                let name = this.workSpace.getNodeByPid(nodeItem.id);
                if (name) {
                    nodeItem.checked = true;
                } else {
                    nodeItem.checked = false;
                    allCheck = false;
                }
            }
            groupNode.checked = allCheck;
        }
        return treeNodes;
    }


    // 获取树的基本配置信息，包括树的事件
    getSetting() {
        let that = this;

        return {
            view: {
                fontCss: getFont,
                nameIsHTML: true
            },
            check: {
                enable: true,
                chkboxType: {
                    'Y': 'ps',
                    'N': 'ps'
                }
            },
            callback: {
                onCheck: function (event: any, treeId: string, treeNode: ITreeNode) {
                    // @ts-ignore
                    let nodes = $.fn.zTree.getZTreeObj('treeDom').transformToArray(treeNode);

                    let checked = treeNode.checked;
                    if (checked) {
                        nodes.forEach((item: any) => {
                            if (!item.children && item.nodeData) that.workSpace.addData(item.nodeData).then();
                        });
                    } else {
                        nodes.forEach((item: any) => {
                            if (!item.children && !!item.nodeData) {
                                that.workSpace.removeDataByPid(item.nodeData.pid);
                            }
                        });
                    }
                },
                onClick: function (event: any, treeId: string, treeNode: ITreeNode) {
                    if (!treeNode.children) {
                        that.workSpace.flyToDataByPid(treeNode.nodeData.pid);
                    }
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
    }
}


function getFont(treeId: string, node: ITreeNode) {
    return node.font ? node.font : {};
}


export { ZTreeMana };
