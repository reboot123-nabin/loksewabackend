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
exports.PasswordResetApiController = void 0;
const User_1 = require("../../../models/User");
const Controller_1 = require("../Kernel/Controller");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordResetApiController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.ringcaptchahost = 'api.ringcaptcha.com';
    }
    reset(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            const user = yield User_1.User.findOne({ phone: `+977${request.body.phone}` });
            if (!user)
                return response.status(404).json({ message: 'Sorry phone doesn\'t exists' });
            response.json({
                status: 'ok',
                phone: user.phone
            });
            // const reset = new PasswordReset({
            //     user : user.id,
            //     reset_token : uuidv4(),
            //     reset_code : randomCode(),
            //     validity : moment().add(15, 'minutes').toDate()
            // })
            // await reset.save()
            // MakeRequest({
            //     host : this.ringcaptchahost,
            //     url : `/${process.env.RINGCAPTCHA_APP_KEY}/sms`,
            //     data : {
            //         app_key : process.env.RINGCAPTCHA_APP_KEY,
            //         api_key : process.env.RINGCAPTCHA_API_KEY,
            //         phone : user.phone,
            //         message : `Your password reset code : ${reset.reset_code}`
            //     }
            // }, function(err : Error, res : any) {
            //     if(err) return response.status(500).json({message : err.message})
            //     response.status(res.status === 'ERROR' ? 500 : 201).json({
            //         status : res.status,
            //         res
            //     })
            // })
        });
    }
    changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            const user = yield User_1.User.findOne({ phone: `+977${request.body.phone}` });
            if (!user)
                return response.status(404).json({ message: 'User does not exists' });
            user.password = bcryptjs_1.default.hashSync(request.body.password, bcryptjs_1.default.genSaltSync(Number(process.env.SALT || 10)));
            yield user.save();
            response.json({
                status: 'ok'
            });
        });
    }
}
exports.PasswordResetApiController = PasswordResetApiController;
