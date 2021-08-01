"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServiceProvider = void 0;
const ServiceProvider_1 = require("./ServiceProvider");
class RouteServiceProvider extends ServiceProvider_1.ServiceProvider {
    boot() { }
    register() {
        this.mapRoutes();
        // api application routes
        this.apiRoutes();
        // always should be in last
        this.errorRoutes();
    }
    mapRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/web'));
    }
    // application routes
    apiRoutes() {
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_auth'));
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_user'));
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_question'));
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_quiz'));
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_category'));
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_notification'));
    }
    errorRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/route_errors'));
    }
}
exports.RouteServiceProvider = RouteServiceProvider;
