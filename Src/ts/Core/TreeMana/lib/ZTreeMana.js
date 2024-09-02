/****************************************************************************
 名称：资源树状图控件
 描述：基于 zTree -- jQuery 树插件，生成资源树状图控件

 最后修改日期：2024-09-01
 ****************************************************************************/
import * as ListenType from '../../../Core/EventMana/impl/ListenType';
import { ConfigTool } from '../../../Core/Config/ConfigTool';
import { arrGrouping } from './arrGrouping';
import { EventMana } from '../../../Core/EventMana/EventMana';
import { getEarth } from '../../../Core/Earth/lib/getEarth';
import { ScopeType } from '../../../Core/EventMana/impl/ScopeType';
import { toFirst } from './toFirst';
class ZTreeMana {
    constructor(viewer, scopeType = ScopeType.Viewer3D, customOption = {}) {
        this.treeNodes = [];
        this.viewer = viewer;
        this.scopeType = scopeType;
        this.customOption = customOption;
        this.workSpace = (scopeType === ScopeType.Viewer3D ? getEarth().viewer3DWorkSpace : getEarth().viewer2DWorkSpace);
        this.upDateTreeNode();
        this.initEvent();
        // @ts-ignore
        window.zTreeMana = this;
    }
    // 初始化资源 【载入、移除】事件
    initEvent() {
        EventMana.sourceEvent.addEventListener(ListenType.DataEventType.addData, this.scopeType, this.upDateTreeNode.bind(this));
        EventMana.sourceEvent.addEventListener(ListenType.DataEventType.removeData, this.scopeType, this.upDateTreeNode.bind(this));
        EventMana.sourceEvent.addEventListener(ListenType.DataEventType.changedData, this.scopeType, this.upDateTreeNode.bind(this));
    }
    // 根据 ConfigTool 的配置信息，初始化树的节点
    getTreeNodeByConfig() {
        const treeNodes = [];
        // 获取配置文件中全部的资源
        let configList = ConfigTool.getAllSources();
        // 过滤掉不需要在树图上显示的资源项
        configList = configList.filter((item) => item.showInTree);
        // 对数据列表，按文件夹进行分组
        let nodeGroupArr = arrGrouping(configList, 'catalog');
        // 将以下这几个指定的分组，提到最前三列
        let firstGroup = ['基础影像', '电子地图', '地形图层'].reverse();
        for (let i = 0; i < firstGroup.length; i++) {
            for (let j = 0; j < nodeGroupArr.length; j++) {
                let items = nodeGroupArr[j];
                if (firstGroup[i] === items[0]['catalog']) {
                    nodeGroupArr = toFirst(nodeGroupArr, j);
                }
            }
        }
        // 往节点数组里新增资源项
        for (let i = 0; i < nodeGroupArr.length; i++) {
            const items = nodeGroupArr[i];
            const name = items[0]['catalog'];
            const lastCatalogNodeOpenState = this.getCatalogNodeOpenState(name);
            let catalogNode = {
                ...this.customOption,
                ...{
                    name: name,
                    open: lastCatalogNodeOpenState,
                    children: [],
                    checked: false,
                    font: this.customOption.font
                }
            };
            let checkNum = 0;
            items.forEach((item) => {
                let icon = null;
                if (item.dataType === 'layer') {
                    icon = require('../../../../img/tree/图层.png');
                }
                else if (item.dataType === 'terrain') {
                    icon = require('../../../../img/tree/地形.png');
                }
                else if (item.dataType === '3DTiles') {
                    icon = require('../../../../img/tree/倾斜摄影.png');
                }
                else if (item.dataType === 'gltf') {
                    icon = require('../../../../img/tree/模型.png');
                }
                else if (item.dataType === 'poi') {
                    icon = require('../../../../img/tree/点.png');
                }
                else if (item.dataType === 'geoJson') {
                    icon = require('../../../../img/tree/geoJson.png');
                }
                let itemNode = {
                    ...this.customOption,
                    ...{
                        id: item.pid,
                        name: item.name,
                        checked: item.show,
                        nodeData: item,
                        icon,
                        font: this.customOption.font
                    }
                };
                item.show && (checkNum++);
                catalogNode.children.push(itemNode);
            });
            checkNum === items.length && (catalogNode.checked = true);
            treeNodes.push(catalogNode);
        }
        return treeNodes;
    }
    upDateTreeNode() {
        this.treeNodes = this.getTreeNodeByConfig();
        // @ts-ignore
        $.fn.zTree.init($('#treeDom'), this.getSetting(), this.treeNodes);
    }
    // 根据名称，获取对应目录节点的展开状态
    getCatalogNodeOpenState(name) {
        const treeIns = window.$.fn.zTree.getZTreeObj('treeDom');
        const nodes = treeIns?.getNodes();
        return nodes?.find((catalogNode) => catalogNode.name === name)?.open || false;
    }
    getResourceNodeShowState(id) {
        return window.$.fn.zTree.getZTreeObj('treeDom').getNodesByParam('id', id).pop();
    }
    // 获取树的基本配置信息，包括树的事件
    getSetting() {
        let that = this;
        return {
            view: {
                fontCss: (treeId, node) => node.font ? node.font : {},
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
                onCheck: (event, treeId, treeNode) => {
                    let nodes = window.$.fn.zTree.getZTreeObj('treeDom').transformToArray(treeNode);
                    let checked = treeNode.checked;
                    if (checked) {
                        nodes.forEach((item) => {
                            if (!item.children && item.nodeData) {
                                that.workSpace.addData(item.nodeData).then();
                                ConfigTool.setResourceParam(item.id, 'show', true);
                            }
                        });
                    }
                    else {
                        nodes.forEach((item) => {
                            if (!item.children && !!item.nodeData) {
                                that.workSpace.removeDataByPid(item.nodeData.pid);
                                ConfigTool.setResourceParam(item.id, 'show', false);
                            }
                        });
                    }
                    this.upDateTreeNode();
                },
                onClick: function (event, treeId, treeNode) {
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
export { ZTreeMana };
