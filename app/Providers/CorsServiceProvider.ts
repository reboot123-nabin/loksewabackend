import {ServiceProvider} from "./ServiceProvider";
import cors from 'cors'

export class CorsServiceProvider extends ServiceProvider {
    boot(): void {
    }

    register(): void {
        this.app.use(cors())
    }
}
