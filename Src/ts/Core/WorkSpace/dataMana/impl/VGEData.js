class VGEData {
    constructor(viewer) {
        this.viewer = viewer;
        this.sourcesItems = [];
        this.instancesMap = new Map();
    }
    getInstancesByPid(pid) {
        return this.instancesMap.get(pid) || null;
    }
    getSourcesItemsByPid(pid) {
        return this.sourcesItems.find(item => item.pid === pid) || null;
    }
    removeAll() {
        this.sourcesItems.forEach(item => {
            this.removeByPid(item.pid);
        });
        return true;
    }
}
export { VGEData };
