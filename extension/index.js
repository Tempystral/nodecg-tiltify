"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_MODE = void 0;
exports.default = default_1;
const utils_1 = require("./utils");
exports.WEBHOOK_MODE = true;
function default_1(nodecg) {
    if ((0, utils_1.isEmpty)(nodecg.bundleConfig.tiltify_webhook_secret) || (0, utils_1.isEmpty)(nodecg.bundleConfig.tiltify_webhook_id)) {
        exports.WEBHOOK_MODE = false;
        nodecg.log.info("Running without webhooks!! Please set webhook secret, and webhook id in cfg/nodecg-tiltify.json [See README]");
        return;
    }
    if ((0, utils_1.isEmpty)(nodecg.bundleConfig.tiltify_client_id)) {
        nodecg.log.info("Please set tiltify_client_id in cfg/nodecg-tiltify.json");
        return;
    }
    if ((0, utils_1.isEmpty)(nodecg.bundleConfig.tiltify_client_secret)) {
        nodecg.log.info("Please set tiltify_client_secret in cfg/nodecg-tiltify.json");
        return;
    }
    if ((0, utils_1.isEmpty)(nodecg.bundleConfig.tiltify_campaign_id)) {
        nodecg.log.info("Please set tiltify_campaign_id in cfg/nodecg-tiltify.json");
        return;
    }
    // Store nodecg for retrieval elsewhere
    (0, utils_1.storeNodeCG)(nodecg);
    // Then load replicants
    require("./utils/replicants");
    // Then load everything else
    require("./tiltifyHandlers");
    require("./messages");
    require("./utils/currency");
}
;
//# sourceMappingURL=index.js.map