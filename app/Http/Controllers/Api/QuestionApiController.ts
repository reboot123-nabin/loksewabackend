import {Request, Response} from 'express';
import {Document} from 'mongoose';
import {Category} from '../../../models/Category';
import {Question} from '../../../models/Question';
import {Controller} from '../Kernel/Controller';

export class QuestionApiController extends Controller {
    constructor() {
        super();
        this.except('Admin', 'getAll');
    }

    saveQuestion(request: Request, response: Response) {
        if (!this.validate(request, response)) return;
        Category.findOne({name: request.body.category}, async (err: Error, result: Document | null) => {
            if (!err && result === null) {
                const category = new Category({name: request.body.category})
                await category.save()
            }
        })
        const question = new Question({
            label: request.body.label,
            category: request.body.category,
            options: request.body.options,
            difficulty: request.body.difficulty,
        });
        question
            .save()
            .then((q: Document) => response.status(201).json(q))
            .catch((err: Error) =>
                response.status(500).json({message: err.message}),
            );
    }

    getAll(request: Request, response: Response) {
        Question.find({}, (err: Error, results: Document[]) => {
            if (err) return response.status(500).json({message: err.message});
            response.json({
                meta: {},
                data: results,
            });
        });
    }

    async findOne(request: Request, response: Response) {
        const question = await Question.findById(request.params.id)
        response.json(question)
    }

    /**
     * update question db level
     * @param request
     * @param response
     */
    async updateQuestion(request: Request, response: Response) {
        const question = await Question.findById(request.params.id)
        if (!question) return response.status(500).json({message: 'Question not found'})

        if (!this.validate(request, response)) return;

        question.label = request.body.label
        question.category = request.body.category
        question.difficulty = request.body.difficulty

        if (question.options) {
            for (let i = 0; i < question.options.length; i++) {
                const option = question.options[i]
                option.value = request.body.options[i].value
                option.is_correct = request.body.options[i].is_correct
            }
        }
        await question.save()
        response.json(question)
    }
}
