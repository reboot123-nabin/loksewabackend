"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUserQuizController = void 0;
const Controller_1 = require("../Kernel/Controller");
const Attempt_1 = require("../../../models/Attempt");
class ApiUserQuizController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    incompleteQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const incomplete = yield Attempt_1.Attempt.find({
                answers: []
            }, null, {})
                .populate('quiz');
            response.json({
                data: incomplete
            });
        });
    }
}
exports.ApiUserQuizController = ApiUserQuizController;
