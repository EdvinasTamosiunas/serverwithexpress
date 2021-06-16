"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.confirmAndCaptureOrder = exports.createPaymentIntent = void 0;
const _1 = require("./");
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
const authorize_1 = require("./authorize");
async function createPaymentIntent(amount) {
    const PaymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        currency: "eur"
    });
    return PaymentIntent;
}
exports.createPaymentIntent = createPaymentIntent;
async function confirmAndCaptureOrder(order) {
    try {
        const result = await axios_1.default.post(index_1.dbApi + '/Order', order, {
            headers: { 'Authorization': `Bearer ${authorize_1.returnAuthToken()}` }
        });
        return result.data;
    }
    catch (error) {
        return error;
    }
}
exports.confirmAndCaptureOrder = confirmAndCaptureOrder;
async function captureRefundPayment(paymentId) {
    try {
        const result = await axios_1.default.post(index_1.dbApi + '/Payment/refund/' + paymentId, {}, {
            headers: { 'Authorization': `Bearer ${authorize_1.returnAuthToken()}` }
        });
        return result.data;
    }
    catch (error) {
        return error;
    }
}
async function refundPayment(order) {
    if (order.payment.paymentMethod === 'stripe') {
        const refund = await refundStripePayment(order);
        await captureRefundPayment(order.payment.id);
        console.log(order.payment.id);
        return refund;
    }
    else if (order.payment.paymentMethod === 'paypal') {
        const refund = await refundPaypalPayment(order);
        await captureRefundPayment(order.payment.id);
        return refund;
    }
    const err = Error();
    err.message = "Invalid payment method";
    return err;
}
exports.refundPayment = refundPayment;
async function refundStripePayment(order) {
    try {
        const payment_intent = await _1.stripe.paymentIntents.retrieve(order.payment.gatewayId);
        let id = "";
        payment_intent.charges.data.forEach(charge => {
            id = charge.id;
        });
        const Refund = await _1.stripe.refunds.create({
            charge: id
        });
        return Refund;
    }
    catch (error) {
        return error;
    }
}
async function refundPaypalPayment(order) {
    try {
        const Refund = await axios_1.default.post(index_1.paypalApi + '/payments/capture/' + order.payment.gatewayId + '/refund', {}, {
            headers: { 'Authorization': `Bearer ${index_1.paypalAuthToken}` }
        });
        return Refund;
    }
    catch (error) {
        return error;
    }
}
//# sourceMappingURL=payments.js.map