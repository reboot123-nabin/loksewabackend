"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const FakeMiddleware_1 = require("./FakeMiddleware");
const TrimString_1 = require("./TrimString");
const AuthMiddleware_1 = require("./AuthMiddleware");
const AdminMiddleware_1 = require("./AdminMiddleware");
class Middleware {
    constructor() {
        this.dependencies = [];
    }
    /**
     * @return {Function} Function
     * @param middleware
     */
    static resolve(middleware) {
        let middlewareInstance = FakeMiddleware_1.FakeMiddleware.getInstance();
        switch (middleware) {
            case 'TrimString':
                middlewareInstance = TrimString_1.TrimString.getInstance();
                break;
            case 'Auth': middlewareInstance = AuthMiddleware_1.AuthMiddleware.getInstance();
            case 'Admin': middlewareInstance = AdminMiddleware_1.AdminMiddleware.getInstance();
        }
        const dependencies = middlewareInstance.dependencies.map((middleware) => middleware.handle.bind(middleware));
        return [...dependencies, middlewareInstance.handle.bind(middlewareInstance)];
    }
}
exports.Middleware = Middleware;
