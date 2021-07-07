import { HomeController } from "../HomeController";
import {BaseKernel} from "./BaseKernel";
import { Controller } from "./Controller";
import {UserApiController} from "../Api/UserApiController";

export class Kernel extends BaseKernel{
    
    /**
     * @param {String} desiredClassName 
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName : string) : Controller {
        switch(desiredClassName) {
            case 'HomeController' : return HomeController.getInstance()
            case 'UserApiController' : return UserApiController.getInstance()

            default : throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }

}