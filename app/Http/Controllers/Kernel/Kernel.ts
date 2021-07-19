import { HomeController } from "../HomeController";
import {BaseKernel} from "./BaseKernel";
import { Controller } from "./Controller";
import {LoginApiController} from "../Api/LoginApiController";
import {UserApiController} from "../Api/UserApiController";
import {PhoneVerificationController} from "../Api/PhoneVerificationController";
import { QuestionApiController } from "../Api/QuestionApiController";
import { QuizApiController } from "../Api/QuizApiController";

export class Kernel extends BaseKernel{
    
    /**
     * @param {String} desiredClassName 
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName : string) : Controller {
        switch(desiredClassName) {
            case 'HomeController' : return HomeController.getInstance()
            case 'LoginApiController' : return LoginApiController.getInstance()
            case 'UserApiController' : return UserApiController.getInstance()
            case 'PhoneVerificationController' : return PhoneVerificationController.getInstance()
            case 'QuestionApiController' : return QuestionApiController.getInstance()
            case 'QuizApiController' : return QuizApiController.getInstance()

            default : throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }

}