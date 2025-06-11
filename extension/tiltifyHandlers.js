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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiltifyEmitter = void 0;
const tiltify_api_client_1 = __importDefault(require("@ericthelemur/tiltify-api-client"));
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
const _1 = require(".");
const utils_1 = require("./utils");
const currency_1 = require("./utils/currency");
const rep = __importStar(require("./utils/replicants"));
const nodecg = (0, utils_1.getNodeCG)();
exports.tiltifyEmitter = new node_stream_1.EventEmitter();
var client = new tiltify_api_client_1.default(nodecg.bundleConfig.tiltify_client_id, nodecg.bundleConfig.tiltify_client_secret);
const app = nodecg.Router();
function pushUniqueDonation(donation) {
    var found = rep.donations.value.find(function (element) {
        return element.id === donation.id;
    });
    if (found === undefined) {
        donation.read = false;
        donation.shown = false;
        donation.modStatus = null;
        (0, currency_1.convertValue)(donation);
        exports.tiltifyEmitter.emit("new-donation", donation);
        rep.donations.value.push(donation);
    }
}
function updateTotal(campaign) {
    // Less than check in case webhooks are sent out-of-order. Only update the total if it's higher!
    if (Number(rep.campaignTotal.value.value) < Number(campaign.amount_raised.value) || rep.campaignTotal.value.currency != campaign.amount_raised.currency) {
        rep.campaignTotal.value = campaign.amount_raised;
    }
}
/**
 * Verifies that the payload delivered matches the signature provided, using sha256 algorithm and the webhook secret
 * Acts as middleware, use in route chain
 */
function validateSignature(req, res, next) {
    const signatureIn = req.get('X-Tiltify-Signature');
    const timestamp = req.get('X-Tiltify-Timestamp');
    const signedPayload = `${timestamp}.${JSON.stringify(req.body)}`;
    const hmac = (0, node_crypto_1.createHmac)('sha256', nodecg.bundleConfig.tiltify_webhook_secret);
    hmac.update(signedPayload);
    const signature = hmac.digest('base64');
    if (signatureIn === signature) {
        if (next != undefined)
            next();
    }
    else {
        // Close connection (200 code MUST be sent regardless)
        res.sendStatus(200);
    }
    ;
}
app.post('/nodecg-tiltify/webhook', validateSignature, (req, res) => {
    // Verify this webhook is sending out stuff for the campaign we're working on
    if (req.body?.meta.event_type === "public:direct:donation_updated" // &&
    // req.body.data.campaign_id === nodecg.bundleConfig.tiltify_campaign_id
    ) {
        // New donation
        pushUniqueDonation(req.body.data);
    }
    else if (req.body.meta.event_type === "public:direct:fact_updated" // &&
    // req.body.data.id === nodecg.bundleConfig.tiltify_campaign_id
    ) {
        // Updated amount raised
        updateTotal(req.body.data);
    }
    // Send ack
    res.sendStatus(200);
});
async function askTiltifyForDonations() {
    client.Campaigns.getRecentDonations(nodecg.bundleConfig.tiltify_campaign_id, function (donations) {
        for (let i = 0; i < donations.length; i++) {
            pushUniqueDonation(donations[i]);
        }
    });
}
async function askTiltifyForAllDonations() {
    client.Campaigns.getDonations(nodecg.bundleConfig.tiltify_campaign_id, function (alldonations) {
        if (JSON.stringify(rep.allDonations.value) !== JSON.stringify(alldonations)) {
            rep.allDonations.value = alldonations;
        }
    });
}
async function askTiltifyForPolls() {
    client.Campaigns.getPolls(nodecg.bundleConfig.tiltify_campaign_id, function (polls) {
        if (JSON.stringify(rep.polls.value) !== JSON.stringify(polls)) {
            rep.polls.value = polls;
        }
    });
}
async function askTiltifyForSchedule() {
    client.Campaigns.getSchedule(nodecg.bundleConfig.tiltify_campaign_id, function (schedule) {
        if (JSON.stringify(rep.schedule.value) !== JSON.stringify(schedule)) {
            rep.schedule.value = schedule;
        }
    });
}
async function askTiltifyForTargets() {
    client.Campaigns.getTargets(nodecg.bundleConfig.tiltify_campaign_id, function (targets) {
        if (JSON.stringify(rep.targets.value) !== JSON.stringify(targets)) {
            rep.targets.value = targets;
        }
    });
}
async function askTiltifyForRewards() {
    client.Campaigns.getRewards(nodecg.bundleConfig.tiltify_campaign_id, function (rewards) {
        if (JSON.stringify(rep.rewards.value) !== JSON.stringify(rewards)) {
            rep.rewards.value = rewards;
        }
    });
}
async function askTiltifyForMilestones() {
    client.Campaigns.getMilestones(nodecg.bundleConfig.tiltify_campaign_id, function (milestones) {
        if (JSON.stringify(rep.milestones.value) !== JSON.stringify(milestones)) {
            rep.milestones.value = milestones;
        }
    });
}
async function askTiltifyForDonors() {
    client.Campaigns.getDonors(nodecg.bundleConfig.tiltify_campaign_id, function (donors) {
        if (JSON.stringify(rep.donors.value) !== JSON.stringify(donors)) {
            rep.donors.value = donors;
        }
    });
}
async function askTiltifyForTotal() {
    client.Campaigns.get(nodecg.bundleConfig.tiltify_campaign_id, function (campaign) {
        updateTotal(campaign);
    });
}
function askTiltify() {
    // Donations and total are handled by websocket normally, only ask if not using websockets
    if (!_1.WEBHOOK_MODE) {
        askTiltifyForDonations();
        askTiltifyForTotal();
    }
    askTiltifyForPolls();
    askTiltifyForTargets();
    askTiltifyForSchedule();
    askTiltifyForRewards();
    askTiltifyForMilestones();
    askTiltifyForDonors();
}
client.initialize().then(() => {
    if (_1.WEBHOOK_MODE) {
        client.Webhook.activate(nodecg.bundleConfig.tiltify_webhook_id, () => {
            nodecg.log.info('Webhooks staged!');
        });
        const events = { "event_types": ["public:direct:fact_updated", "public:direct:donation_updated"] };
        client.Webhook.subscribe(nodecg.bundleConfig.tiltify_webhook_id, nodecg.bundleConfig.tiltify_campaign_id, events, () => {
            nodecg.log.info('Webhooks activated!');
        });
    }
    askTiltifyForTotal();
    askTiltify();
    askTiltifyForAllDonations();
    setInterval(function () {
        askTiltify();
    }, _1.WEBHOOK_MODE ? 10000 : 5000);
    setInterval(function () {
        askTiltifyForAllDonations();
    }, 5 * 60000);
});
nodecg.mount(app);
//# sourceMappingURL=tiltifyHandlers.js.map