"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const HomeController_1 = require("../HomeController");
const BaseKernel_1 = require("./BaseKernel");
const LoginApiController_1 = require("../Api/LoginApiController");
const UserApiController_1 = require("../Api/UserApiController");
const PhoneVerificationController_1 = require("../Api/PhoneVerificationController");
const QuestionApiController_1 = require("../Api/QuestionApiController");
const QuizApiController_1 = require("../Api/QuizApiController");
const CategoryApiController_1 = require("../Api/CategoryApiController");
const NotificationApiController_1 = require("../Api/NotificationApiController");
const ApiUserQuizController_1 = require("../Api/ApiUserQuizController");
const PasswordResetApiController_1 = require("../Api/PasswordResetApiController");
class Kernel extends BaseKernel_1.BaseKernel {
    /**
     * @param {String} desiredClassName
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName) {
        switch (desiredClassName) {
            case 'HomeController': return HomeController_1.HomeController.getInstance();
            case 'LoginApiController': return LoginApiController_1.LoginApiController.getInstance();
            case 'UserApiController': return UserApiController_1.UserApiController.getInstance();
            case 'PhoneVerificationController': return PhoneVerificationController_1.PhoneVerificationController.getInstance();
            case 'QuestionApiController': return QuestionApiController_1.QuestionApiController.getInstance();
            case 'QuizApiController': return QuizApiController_1.QuizApiController.getInstance();
            case "CategoryApiController": return CategoryApiController_1.CategoryApiController.getInstance();
            case "NotificationApiController": return NotificationApiController_1.NotificationApiController.getInstance();
            case "ApiUserQuizController": return ApiUserQuizController_1.ApiUserQuizController.getInstance();
            case "PasswordResetApiController": return PasswordResetApiController_1.PasswordResetApiController.getInstance();
            default: throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }
}
exports.Kernel = Kernel;
