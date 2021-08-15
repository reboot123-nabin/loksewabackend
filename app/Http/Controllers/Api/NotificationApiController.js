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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationApiController = void 0;
const Controller_1 = require("../Kernel/Controller");
const Notification_1 = require("../../../models/Notification");
class NotificationApiController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    getAll(request, response) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            };
            if (typeof ((_b = request.body) === null || _b === void 0 ? void 0 : _b.read) === 'number') {
                Object.assign(options, { read: !!((_c = request.body) === null || _c === void 0 ? void 0 : _c.read) });
            }
            const notifications = yield Notification_1.Notification.find(options, null, {
                limit: 10, skip: ((((_d = request.body) === null || _d === void 0 ? void 0 : _d.page) || 1) - 1) * 10
            });
            const total = yield Notification_1.Notification.find(options).estimatedDocumentCount();
            response.json({
                meta: {
                    read: !!((_e = request.body) === null || _e === void 0 ? void 0 : _e.read),
                    page: ((_f = request.body) === null || _f === void 0 ? void 0 : _f.page) || 1,
                    total
                },
                data: notifications
            });
        });
    }
    read(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.Notification.findOne({
                read: false,
                _id: request.params.id
            });
            if (!notification)
                return response.json({ status: 'ok' });
            notification.read = true;
            notification.read_at = new Date();
            yield notification.save();
            response.json({ status: 'ok', notification });
        });
    }
}
exports.NotificationApiController = NotificationApiController;
