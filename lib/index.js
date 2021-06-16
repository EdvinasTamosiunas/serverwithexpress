"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalAuthToken = exports.paypalApi = exports.Password = exports.Username = exports.dbApi = exports.stripe = void 0;
const dotenv_1 = require("dotenv");
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.config();
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Initialize Stripe
const stripe_1 = __importDefault(require("stripe"));
const cron = require('node-cron');
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: '2020-08-27',
});
exports.dbApi = process.env.DB_API;
exports.Username = process.env.API_USERNAME;
exports.Password = process.env.API_PASSWORD;
exports.paypalApi = process.env.PAYPAL_API;
exports.paypalAuthToken = process.env.PAYPAL_AUTH_TOKEN;
const api_1 = require("./api");
const port = process.env.PORT || 3333;
const authorize_1 = require("./authorize");
api_1.app.listen(port, async () => {
    authorize_1.getAuthToken();
    const authTask = cron.schedule('*/59 * * * *', () => {
        authorize_1.getAuthToken().then(result => console.log(result));
    });
    authTask.start();
    console.log(`API available on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map