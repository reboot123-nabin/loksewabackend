"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = void 0;
const AbstractMiddleware_1 = require("./AbstractMiddleware");
const AuthMiddleware_1 = require("./AuthMiddleware");
class AdminMiddleware extends AbstractMiddleware_1.Middleware {
    constructor() {
        super();
        this.dependencies = [AuthMiddleware_1.AuthMiddleware.getInstance()];
    }
    handle(request, response, next) {
        var _a;
        if (((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('userType')) !== 'admin') {
            return response.status(401).json({ message: 'Unauthorized request' });
        }
        next();
    }
}
exports.AdminMiddleware = AdminMiddleware;
