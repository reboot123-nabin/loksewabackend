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
exports.QuestionApiController = void 0;
const Category_1 = require("../../../models/Category");
const Question_1 = require("../../../models/Question");
const Controller_1 = require("../Kernel/Controller");
class QuestionApiController extends Controller_1.Controller {
    constructor() {
        super();
        this.except('Admin', 'getAll');
    }
    saveQuestion(request, response) {
        if (!this.validate(request, response))
            return;
        Category_1.Category.findOne({ name: request.body.category }, (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (!err && result === null) {
                const category = new Category_1.Category({ name: request.body.category });
                yield category.save();
            }
        }));
        const question = new Question_1.Question({
            label: request.body.label,
            category: request.body.category,
            options: request.body.options,
            difficulty: request.body.difficulty,
        });
        question
            .save()
            .then((q) => response.status(201).json(q))
            .catch((err) => response.status(500).json({ message: err.message }));
    }
    getAll(request, response) {
        Question_1.Question.find({}, (err, results) => {
            if (err)
                return response.status(500).json({ message: err.message });
            response.json({
                meta: {},
                data: results,
            });
        });
    }
    findOne(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield Question_1.Question.findById(request.params.id);
            response.json(question);
        });
    }
    /**
     * update question db level
     * @param request
     * @param response
     */
    updateQuestion(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield Question_1.Question.findById(request.params.id);
            if (!question)
                return response.status(500).json({ message: 'Question not found' });
            if (!this.validate(request, response))
                return;
            question.label = request.body.label;
            question.category = request.body.category;
            question.difficulty = request.body.difficulty;
            if (question.options) {
                for (let i = 0; i < question.options.length; i++) {
                    const option = question.options[i];
                    option.value = request.body.options[i].value;
                    option.is_correct = request.body.options[i].is_correct;
                }
            }
            yield question.save();
            response.json(question);
        });
    }
}
exports.QuestionApiController = QuestionApiController;
