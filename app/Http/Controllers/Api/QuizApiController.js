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
const Attempt_1 = require("../../../models/Attempt");
const Question_1 = require("../../../models/Question");
const Quiz_1 = require("../../../models/Quiz");
const Controller_1 = require("../Kernel/Controller");
const notificationHelper_1 = require("../../../Helpers/notificationHelper");
const RewardPoint_1 = require("../../../models/RewardPoint");
class QuizApiController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    createQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            Question_1.Question.findRandom({
                category: request.body.category,
                difficulty: request.body.difficulty,
            }, "label category difficulty options._id options.value", {
                limit: request.body.count,
            }, (err, results) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (err)
                    return response.status(500).json({ message: err.message });
                const quiz = new Quiz_1.Quiz({
                    title: request.body.title,
                    difficulty: request.body.difficulty,
                    category: request.body.category,
                    count: request.body.count,
                    questions: results === null || results === void 0 ? void 0 : results.map((x) => x.id),
                });
                yield quiz.save();
                //create user notification
                yield notificationHelper_1.notify({
                    title: 'New quiz created',
                    message: `A quiz named '${quiz.title}' is created by ${(_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('first_name')}'`,
                    uri: '/quiz/' + quiz.id,
                    user: (_b = request.auth) === null || _b === void 0 ? void 0 : _b.id(),
                });
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.Quiz.findById(request.params.id).populate("questions", "label category options.value options._id" + (((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('userType')) === 'admin' ? ' options.is_correct' : ''));
            response.json(quiz);
        });
    }
    attempt(request, response) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            let attempt = yield Attempt_1.Attempt.findOne({
                quiz: request.params.quiz,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            }).populate('quiz');
            if (attempt !== null) {
                yield Quiz_1.Quiz.populate(attempt.quiz, {
                    path: 'questions',
                    model: Question_1.Question
                });
            }
            if (attempt == null) {
                attempt = new Attempt_1.Attempt({
                    quiz: request.params.quiz,
                    user: (_b = request.auth) === null || _b === void 0 ? void 0 : _b.id()
                });
                yield Attempt_1.Attempt.populate(attempt, {
                    path: 'quiz',
                    populate: {
                        path: 'questions'
                    }
                });
            }
            let correct = false;
            if (typeof attempt.quiz !== 'string')
                attempt.quiz.questions.filter((x) => x.id == request.params.question).map((question) => {
                    var _a;
                    (_a = question === null || question === void 0 ? void 0 : question.options) === null || _a === void 0 ? void 0 : _a.map((option) => {
                        if (option.id === request.body.answer && option.is_correct) {
                            correct = true;
                        }
                        return option;
                    });
                    return question;
                });
            if (correct) {
                const point = new RewardPoint_1.RewardPoint();
                point.point = 10;
                point.remarks = "10 points for correct answer";
                point.meta = {
                    quiz: request.params.quiz,
                    question: request.params.question,
                    answer: request.body.answer
                };
                yield point.save();
                const user = (_c = request.auth) === null || _c === void 0 ? void 0 : _c.user();
                user.points = (user.points || 0) + 10;
                yield user.save();
            }
            attempt.answers.push({
                question: request.params.question,
                answer: request.body.answer,
                correct
            });
            attempt
                .save()
                .then(() => response.status(201).json({ status: "ok", correct }))
                .catch((err) => response.status(500).json({ message: err.message }));
        });
    }
    /**
     * delete quiz from db
     * @param request
     * @param response
     */
    deleteQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Quiz_1.Quiz.findByIdAndDelete(request.params.id, { useFindAndModify: false });
            response.json({ status: 'ok', result });
        });
    }
}
exports.QuizApiController = QuizApiController;
