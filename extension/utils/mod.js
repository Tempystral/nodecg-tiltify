"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CENSORED = exports.UNDECIDED = exports.APPROVED = void 0;
exports.tripleState = tripleState;
exports.APPROVED = true, exports.UNDECIDED = null, exports.CENSORED = false;
function tripleState(v, appVal, undecVal, cenVal) {
    // Shorthand for setting a value for each of the 3 mod states
    return v === exports.APPROVED ? appVal : (v === exports.CENSORED ? cenVal : undecVal);
}
//# sourceMappingURL=mod.js.map