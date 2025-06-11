"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const mod_1 = require("./utils/mod");
const rep = __importStar(require("./utils/replicants"));
const nodecg = (0, utils_1.getNodeCG)();
function setAll(prop, value, ack) {
    for (let i = 0; i < rep.donations.value.length; i++) {
        rep.donations.value[i][prop] = value;
    }
    if (ack && !ack.handled) {
        ack(null, value);
    }
}
nodecg.listenFor("clear-donations", (value, ack) => {
    setAll("read", true, ack);
});
nodecg.listenFor("approve-all-donations", (value, ack) => {
    setAll("modStatus", value, ack);
});
function searchAndSet(id, prop, value, ack) {
    nodecg.log.info("Mark", prop, id, value);
    var elementIndex = rep.donations.value.findIndex((d) => d.id === id);
    if (elementIndex !== -1) {
        const elem = rep.donations.value[elementIndex];
        if (elem[prop] != value)
            elem[prop] = value;
        if (ack && !ack.handled) {
            ack(null, null);
        }
        return rep.donations.value[elementIndex];
    }
    else {
        if (ack && !ack.handled) {
            nodecg.log.error('Donation not found to mark as read | id:', id);
            ack(new Error("Donation not found to mark as read"), null);
        }
        return undefined;
    }
}
nodecg.listenFor("set-donation-read", ([dono, readVal], ack) => {
    const d = searchAndSet(dono.id, "read", readVal, ack);
    if (d && readVal && d.modStatus === mod_1.UNDECIDED)
        d.modStatus = mod_1.APPROVED;
});
nodecg.listenFor("set-donation-shown", ([dono, shownVal], ack) => {
    searchAndSet(dono.id, "shown", shownVal, ack);
});
nodecg.listenFor("set-donation-modstatus", ([dono, statusVal], ack) => {
    const d = searchAndSet(dono.id, "modStatus", statusVal, ack);
    if (d && !d.shown && statusVal === mod_1.APPROVED)
        nodecg.sendMessage("show-dono", dono);
    if (d && d.shown && statusVal !== mod_1.APPROVED)
        nodecg.sendMessage("revoke-dono", dono);
});
//# sourceMappingURL=messages.js.map