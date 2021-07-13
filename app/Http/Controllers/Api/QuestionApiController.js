"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionApiController = void 0;
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
        const question = new Question_1.Question({
            label: request.body.label,
            category: request.body.category,
            options: request.body.options
        });
        question.save().then((q) => response.status(201).json(q))
            .catch((err) => response.status(500).json({ message: err.message }));
    }
    getAll(request, response) {
        Question_1.Question.find({}, (err, results) => {
            if (err)
                return response.status(500).json({ message: err.message });
            response.json({
                meta: {},
                data: results
            });
        });
    }
}
exports.QuestionApiController = QuestionApiController;
