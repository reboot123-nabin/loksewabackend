"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginApiController = void 0;
const Controller_1 = require("../Kernel/Controller");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginApiController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.app_key = process.env.APP_KEY || '';
        this.expiresIn = '7d';
    }
    register(request, response) {
        if (!this.validate(request, response))
            return;
        const salt = bcryptjs_1.default.genSaltSync(Number(process.env.SALT || 10));
        const newUser = new User_1.User({
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            gender: request.body.gender || null,
            email: request.body.email,
            phone: request.body.phone,
            password: bcryptjs_1.default.hashSync(request.body.password, salt)
        });
        newUser.save().then((user) => __awaiter(this, void 0, void 0, function* () {
            const code = Math.floor(1000 + Math.random() * 9000);
            user.code = 1234 || code;
            user.save();
            const token = yield jsonwebtoken_1.default.sign({ data: { id: user.id } }, this.app_key, { expiresIn: this.expiresIn });
            if (process.env.NODE_ENV === 'development') {
                return response.status(201).json({ data: user, token });
            }
            return response.status(201).json({ token: token, data: user });
        })).catch(function (err) {
            response.status(500).json({ message: err.message });
        });
    }
    login(request, response) {
        if (!this.validate(request, response))
            return;
        const expiresIn = request.body.rememberMe ? '30d' : this.expiresIn;
        const res = { errors: { email: 'Your login credentials did not match our records.' } };
        let attempted = false;
        const getAccessToken = (err, user) => {
            var _a;
            if (!user) {
                if (attempted)
                    return response.status(422).json(res);
                attempted = true;
                const phone = ((_a = request.body.email) === null || _a === void 0 ? void 0 : _a.startsWith('+977')) ? request.body.email : `+977${request.body.email}`;
                return User_1.User.findOne({ phone }, getAccessToken);
            }
            if (err)
                return response.status(500).json({ message: err.message });
            if (!bcryptjs_1.default.compareSync(request.body.password, user.password))
                return response.status(422).json(res);
            // if(!user.verifiedAt) return response.status(403).json({message: 'Email is not verified'})
            jsonwebtoken_1.default.sign({ data: { id: user.id } }, this.app_key, { expiresIn }, function (err, token) {
                if (err)
                    return response.status(500).json({ message: err.message });
                response.json({ token, user });
            });
        };
        User_1.User.findOne({ email: request.body.email }, getAccessToken);
    }
}
exports.LoginApiController = LoginApiController;
