"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donors = exports.milestones = exports.rewards = exports.targets = exports.schedule = exports.polls = exports.campaignTotal = exports.allDonations = exports.donations = void 0;
const _1 = require(".");
const nodecg = (0, _1.getNodeCG)();
exports.donations = nodecg.Replicant("donations");
exports.allDonations = nodecg.Replicant("alldonations");
exports.campaignTotal = nodecg.Replicant("total");
exports.polls = nodecg.Replicant("polls");
exports.schedule = nodecg.Replicant("schedule");
exports.targets = nodecg.Replicant("targets");
exports.rewards = nodecg.Replicant("rewards");
exports.milestones = nodecg.Replicant("milestones");
exports.donors = nodecg.Replicant("donors");
//# sourceMappingURL=replicants.js.map