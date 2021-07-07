"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
const HomeController_1 = require("../HomeController");
const BaseKernel_1 = require("./BaseKernel");
class Kernel extends BaseKernel_1.BaseKernel {
    /**
     * @param {String} desiredClassName
     * @returns {Object} desiredClassObject
     */
    createRelevantClass(desiredClassName) {
        switch (desiredClassName) {
            case 'HomeController': return HomeController_1.HomeController.getInstance();
            default: throw new Error(`Controller [${desiredClassName}] does not exists`);
        }
    }
}
exports.Kernel = Kernel;
