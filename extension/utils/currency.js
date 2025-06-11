"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionRates = void 0;
exports.convertValue = convertValue;
const _1 = require(".");
const replicants_1 = require("./replicants");
const nodecg = (0, _1.getNodeCG)();
exports.conversionRates = {
    USD: 1.2461833299,
    AUD: 1.9125802417,
    BRL: 6.1138013225,
    CAD: 1.7095394992,
    DKK: 8.5156950429,
    EUR: 1.1418281377,
    GBP: 1.0,
    JPY: 186.4645194486,
    MXN: 21.4624577112,
    NOK: 13.4646396158,
    NZD: 2.079581301,
    PLN: 5.0062181164
};
if (nodecg.bundleConfig.freecurrencyapi_key) {
    fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${nodecg.bundleConfig.freecurrencyapi_key}&base_currency=${nodecg.bundleConfig.display_currency}`)
        .then((r) => r.json())
        .then((j) => {
        exports.conversionRates = j.data;
        nodecg.log.info("Conversion rates loaded, refreshing all conversions");
        convertAll();
    });
}
else
    convertAll();
function convertAll() {
    console.log("Converting all currencies");
    replicants_1.donations.value.forEach(convertValue);
}
function convertValue(dono) {
    const disp = nodecg.bundleConfig.display_currency;
    if (disp === undefined)
        return;
    var val;
    if (dono.amount.currency == disp) {
        val = Number(dono.amount.value);
    }
    else if (dono.amount.currency in exports.conversionRates) {
        val = Number(dono.amount.value) / exports.conversionRates[dono.amount.currency];
    }
    else
        return;
    if (!dono.displayAmount || dono.displayAmount.value !== val) {
        dono.displayAmount = {
            currency: disp,
            value: val.toString()
        };
    }
}
//# sourceMappingURL=currency.js.map