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
                var _a;
                if (err)
                    return response.status(500).json({ message: err.message });
                const quiz = new Quiz_1.Quiz({
                    title: request.body.title,
                    difficulty: request.body.difficulty,
                    category: request.body.category,
                    points: 10,
                    count: request.body.count,
                    questions: results === null || results === void 0 ? void 0 : results.map((x) => x.id),
                });
                yield quiz.save();
                //create user notification
                yield notificationHelper_1.notify({
                    title: 'New quiz created',
                    message: `A quiz named '${quiz.title}' is created.`,
                    uri: '/quiz/' + quiz.id,
                    user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id(),
                });
                response.status(201).json(quiz);
            }));
        });
    }
    //User buys quiz with reward (quiz) points
    purchaseQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            Question_1.Question.findRandom({
                category: request.body.category,
            }, "label category difficulty options._id options.value", {
                limit: request.body.count,
            }, (err, results) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                if (err)
                    return response.status(500).json({ message: err.message });
                const p_quiz = new Quiz_1.Quiz({
                    title: request.body.title,
                    category: request.body.category,
                    points: 5,
                    count: request.body.count,
                    questions: results === null || results === void 0 ? void 0 : results.map((x) => x.id),
                    user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id(),
                });
                yield p_quiz.save();
                //deduct reward (quiz) points
                const rp = (_b = request.auth) === null || _b === void 0 ? void 0 : _b.user().points;
                const deductAmt = request.body.count * 3;
                if (deductAmt <= rp) {
                    const new_rp = rp - deductAmt;
                    if ((_c = request.auth) === null || _c === void 0 ? void 0 : _c.user()) {
                        request.auth.user().points = new_rp;
                        yield request.auth.user().save();
                    }
                    //insert in reward points collection
                    const point = new RewardPoint_1.RewardPoint();
                    point.point = -(request.body.count * 3);
                    point.remarks = point.point + " points deducted for quiz purchase";
                    point.user = (_d = request.auth) === null || _d === void 0 ? void 0 : _d.id();
                    yield point.save();
                    //create user notification
                    yield notificationHelper_1.notify({
                        title: 'Quiz purchased!',
                        message: `Your quiz is purchased and ready to be played.`,
                        uri: '/quiz/' + p_quiz.id,
                        user: (_e = request.auth) === null || _e === void 0 ? void 0 : _e.id(),
                    });
                    response.status(201).json(p_quiz);
                }
                else
                    return response.status(201).json({ message: "Not enough balance." });
            }));
        });
    }
    //User buys quiz with reward (quiz) points
    topupBalance(request, response) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            //deduct reward (quiz) points
            const rp = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.user().points;
            const deductAmt = request.body.count * 3;
            if (deductAmt <= rp) {
                const new_rp = rp - deductAmt;
                if ((_b = request.auth) === null || _b === void 0 ? void 0 : _b.user()) {
                    request.auth.user().points = new_rp;
                    yield request.auth.user().save();
                }
                //insert in reward points collection
                const point = new RewardPoint_1.RewardPoint();
                point.point = -(request.body.count * 10);
                point.remarks = point.point + "points deducted for mobile topip,";
                point.user = (_c = request.auth) === null || _c === void 0 ? void 0 : _c.id();
                yield point.save();
                //create user notification
                yield notificationHelper_1.notify({
                    title: 'Quiz purchased!',
                    message: `Your quiz is purchased and ready to be played.`,
                    uri: '/',
                    user: (_d = request.auth) === null || _d === void 0 ? void 0 : _d.id(),
                });
                response.status(201).json({ status: "ok" });
            }
            else
                return response.status(201).json({ message: "Not enough balance." });
        });
    }
    getAll(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Quiz_1.Quiz.find({}).populate({
                path: 'attempts',
                match: {
                    user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
                }
            });
            response.json(results.map((q) => {
                var _a;
                const quiz = q.toObject();
                quiz.completed = quiz.attempts && ((_a = quiz.attempts[0]) === null || _a === void 0 ? void 0 : _a.completed);
                return quiz;
            }));
        });
    }
    findOne(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.Quiz.findById(request.params.id).populate("questions", "label category options.value options._id" + (((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('userType')) === 'admin' ? ' options.is_correct' : ''));
            if (!quiz)
                return response.status(404).json({ message: 'Quiz not found' });
            const attempt = yield Attempt_1.Attempt.findOne({
                quiz: quiz.id.toString(),
                user: (_b = request.auth) === null || _b === void 0 ? void 0 : _b.id()
            });
            const answeredQuestions = (attempt === null || attempt === void 0 ? void 0 : attempt.answers.map(ans => ans.question)) || [];
            const questions = quiz.questions.map((question) => {
                const q = question.toObject();
                q.alreadyAnswered = answeredQuestions.includes(question.id.toString());
                return q;
            });
            // response.json(quiz);
            response.json(Object.assign(Object.assign({}, quiz.toObject()), { questions, answeredQuestions }));
        });
    }
    attempt(request, response) {
        var _a, _b, _c, _d;
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
            // check for already answered
            const exists = attempt.answers.filter(function ({ question }) {
                return question == request.params.question;
            });
            if (exists.length) {
                return response.json({ status: 'ok1', correct: exists[0].correct });
            }
            let correct = false;
            if (typeof attempt.quiz !== 'string') {
                // check questions exists
                const questionExists = attempt.quiz.questions.map((q) => q.id.toString()).includes(request.params.question);
                if (!questionExists) {
                    return response.status(404).json({ message: 'Question does not exsists' });
                }
                // check for correct answer
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
            }
            if (correct) {
                const point = new RewardPoint_1.RewardPoint();
                point.point = typeof attempt.quiz !== 'string' ? (attempt.quiz.points || 10) : 10;
                point.remarks = point.point + " points for correct answer";
                point.user = (_c = request.auth) === null || _c === void 0 ? void 0 : _c.id(),
                    point.meta = {
                        quiz: request.params.quiz,
                        question: request.params.question,
                        answer: request.body.answer
                    };
                yield point.save();
                const user = (_d = request.auth) === null || _d === void 0 ? void 0 : _d.user();
                user.points = (user.points || 0) + point.point;
                yield user.save();
            }
            attempt.answers.push({
                question: request.params.question,
                answer: request.body.answer,
                correct
            });
            if (typeof attempt.quiz !== 'string') {
                attempt.completed = attempt.quiz.questions.length === attempt.answers.length;
            }
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
