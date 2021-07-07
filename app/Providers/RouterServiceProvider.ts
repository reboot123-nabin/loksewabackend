import { ServiceProvider } from "./ServiceProvider";

export class RouteServiceProvider extends ServiceProvider {
    boot() {}
    
    register() {
        this.mapRoutes()
        this.apiRoutes()

        // always should be in last
        this.errorRoutes()
    }

    mapRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/web'))
    }

    apiRoutes() {
    }

    private errorRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/route_errors'))
    }
}