"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneVerificationController = void 0;
const Controller_1 = require("../Kernel/Controller");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class PhoneVerificationController extends Controller_1.Controller {
    generateCode(request, response) {
        if (!this.validate(request, response))
            return;
        const APP_KEY = process.env.RINGCAPTCHA_APP_KEY;
        const service = request.params.service;
        axios_1.default.post(`https://api.ringcaptcha.com/${APP_KEY}/code/${service}`, querystring_1.default.stringify({
            phone: request.body.phone,
            api_key: process.env.RINGCAPTCHA_API_KEY,
            locale: 'en'
        }), {
            headers: {
                "Content-Type": "application/x-www-url-encoded; charset=utf-8"
            }
        }).then((res) => {
            if (res.data.status === 'ERROR')
                return response.status(500).json({ message: res.data.message });
            response.status(201).json(res.data);
        }).catch((err) => response.status(500).json({ message: err.message }));
    }
    verify(request, response) {
        if (!this.validate(request, response))
            return;
        const APP_KEY = process.env.RINGCAPTCHA_APP_KEY;
        axios_1.default.post(`https://api.ringcaptcha.com/${APP_KEY}/verify`, querystring_1.default.stringify({
            phone: request.body.phone,
            code: request.body.code,
            api_key: process.env.RINGCAPTCHA_API_KEY,
        }), {
            headers: {
                "Content-Type": "application/x-www-url-encoded; charset=utf-8"
            }
        }).then((res) => {
            if (res.data.status === 'ERROR')
                return response.status(500).json({ message: res.data.message });
            response.json(res.data);
        }).catch((err) => response.status(500).json({ message: err.message }));
    }
}
exports.PhoneVerificationController = PhoneVerificationController;
