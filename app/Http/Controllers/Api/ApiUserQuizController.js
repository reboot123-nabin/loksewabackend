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
const RewardPoint_1 = require("../../../models/RewardPoint");
class ApiUserQuizController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    incompleteQuiz(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const incomplete = yield Attempt_1.Attempt.find({
                completed: false
            }, null, {})
                .populate('quiz');
            response.json({
                data: incomplete
            });
        });
    }
    resultAssessment(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const attempt = yield Attempt_1.Attempt.findOne({
                quiz: request.params.id,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            }).populate({
                path: 'quiz',
                populate: {
                    path: 'questions'
                }
            });
            if (!attempt)
                return response.status(404).json({ message: 'Quiz not found' });
            return response.json({
                data: attempt
            });
        });
    }
    leaderboard(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = request.query.type || 'daily';
            const points = yield RewardPoint_1.RewardPoint.aggregate([
                {
                    $project: {
                        _id: 0,
                        user: '$user',
                        points: { $cond: [{ $gt: ['$point', 0] }, '$point', 0] },
                        createdAt: '$createdAt'
                    }
                },
                {
                    $group: {
                        _id: {
                            user: '$user',
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        points: { $sum: '$points' }
                    }
                },
                {
                    $match: {
                        '_id.year': new Date().getFullYear(),
                        '_id.month': new Date().getMonth() + 1,
                        '_id.day': new Date().getDate()
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id.user",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                {
                    $sort: {
                        points: -1
                    }
                }
            ]);
            response.json({
                data: points.map(rp => {
                    const c = rp.users[0];
                    c.points = rp.points;
                    return c;
                })
            });
        });
    }
}
exports.ApiUserQuizController = ApiUserQuizController;
