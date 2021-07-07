import { ServiceProvider } from "./ServiceProvider";

export class RouteServiceProvider extends ServiceProvider {
    boot() {}
    
    register() {
        this.mapRoutes()
        // api application routes
        this.apiRoutes()

        // always should be in last
        this.errorRoutes()
    }

    mapRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/web'))
    }

    // application routes
    apiRoutes() {
        this.app.use('/api/v1', require(process.cwd() + '/routes/api/route_auth'))
    }

    private errorRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/route_errors'))
    }
}