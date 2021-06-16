"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAuthToken = exports.getAuthToken = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
var dbApiAuthToken = '';
async function getAuthToken() {
    var login = { username: "", password: "" };
    login.username = index_1.Username;
    login.password = index_1.Password;
    try {
        const result = await axios_1.default.post(index_1.dbApi + '/User/login', login);
        dbApiAuthToken = result.data.token;
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.getAuthToken = getAuthToken;
function returnAuthToken() {
    return dbApiAuthToken;
}
exports.returnAuthToken = returnAuthToken;
//# sourceMappingURL=authorize.js.map