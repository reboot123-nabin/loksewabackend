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
exports.CategoryApiController = void 0;
const Category_1 = require("../../../models/Category");
const Controller_1 = require("../Kernel/Controller");
const Question_1 = require("../../../models/Question");
const Quiz_1 = require("../../../models/Quiz");
class CategoryApiController extends Controller_1.Controller {
    constructor() {
        super();
        this.except('Auth', 'getAll');
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Category_1.Category.find({});
            response.json(results);
        });
    }
    getQuiz(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findById(request.params.id);
            if (!category)
                return response.status(500).json({ message: 'Category not found' });
            const quiz = new Quiz_1.Quiz({
                title: 'Category wise quiz',
                category: category.name,
                difficulty: 'Medium',
                count: 10,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            });
            Question_1.Question.findRandom({
                category: category.name
            }, "label category difficulty options._id options.value", {
                limit: 10
            }, (err, results) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return response.status(500).json({ message: err.message });
                if (results) {
                    quiz.questions = results === null || results === void 0 ? void 0 : results.map((question) => question.id);
                }
                yield quiz.save();
                response.status(201).json(Object.assign(Object.assign({}, quiz.toObject()), { questions: results }));
            }));
        });
    }
}
exports.CategoryApiController = CategoryApiController;
