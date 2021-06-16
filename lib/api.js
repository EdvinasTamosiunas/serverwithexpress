"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
// Allows cross origin requests
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
exports.app.use(express_1.default.json());
const payments_1 = require("./payments");
exports.app.post('/createpaymentintent', runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
exports.app.post('/captureOrder', runAsync(async ({ body }, res) => {
    res.send(await payments_1.confirmAndCaptureOrder(body));
}));
exports.app.post('/refundpayment', runAsync(async ({ body }, res) => {
    res.send(await payments_1.refundPayment(body));
}));
const webhooks_1 = require("./webhooks");
exports.app.post('/hooks', runAsync(webhooks_1.handleStripeWebhook));
//helper
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
//# sourceMappingURL=api.js.map