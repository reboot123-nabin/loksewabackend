"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const HomeController_1 = require("../HomeController");
const BaseKernel_1 = require("./BaseKernel");
const LoginApiController_1 = require("../Api/LoginApiController");
const UserApiController_1 = require("../Api/UserApiController");
const PhoneVerificationController_1 = require("../Api/PhoneVerificationController");
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
            default: throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }
}
exports.Kernel = Kernel;
