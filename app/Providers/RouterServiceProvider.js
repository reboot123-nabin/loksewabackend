"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServiceProvider = void 0;
const ServiceProvider_1 = require("./ServiceProvider");
class RouteServiceProvider extends ServiceProvider_1.ServiceProvider {
    boot() { }
    register() {
        this.mapRoutes();
        this.apiRoutes();
        // always should be in last
        this.errorRoutes();
    }
    mapRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/web'));
    }
    apiRoutes() {
    }
    errorRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/route_errors'));
    }
}
exports.RouteServiceProvider = RouteServiceProvider;
