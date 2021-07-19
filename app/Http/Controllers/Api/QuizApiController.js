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
exports.QuizApiController = void 0;
const Question_1 = require("../../../models/Question");
const Quiz_1 = require("../../../models/Quiz");
const Controller_1 = require("../Kernel/Controller");
class QuizApiController extends Controller_1.Controller {
    createQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            Question_1.Question.findRandom({
                category: request.body.category,
                difficulty: request.body.difficulty
            }, 'label category difficulty options._id options.value', {
                limit: request.body.count
            }, (err, results) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return response.status(500).json({ message: err.message });
                const quiz = new Quiz_1.Quiz({
                    title: request.body.title,
                    difficulty: request.body.difficulty,
                    category: request.body.category,
                    count: request.body.count,
                    questions: results === null || results === void 0 ? void 0 : results.map(x => x.id)
                });
                yield quiz.save();
                response.status(201).json(quiz);
            }));
        });
    }
    getAll(request, response) {
        Quiz_1.Quiz.find({}, (err, results) => {
            response.json(results);
        });
    }
    findOne(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.Quiz.findById(request.params.id).populate('questions', 'label category options.value options._id');
            response.json(quiz);
        });
    }
}
exports.QuizApiController = QuizApiController;
