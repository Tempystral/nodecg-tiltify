"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeNodeCG = storeNodeCG;
exports.getNodeCG = getNodeCG;
exports.isEmpty = isEmpty;
let nodecg;
function storeNodeCG(ncg) {
    nodecg = ncg;
}
function getNodeCG() {
    return nodecg;
}
function isEmpty(string) {
    return string === undefined || string === null || string === "";
}
//# sourceMappingURL=index.js.map