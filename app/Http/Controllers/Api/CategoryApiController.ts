import { Request, Response } from "express";
import { Category } from "../../../models/Category";
import { Controller } from "../Kernel/Controller";
import {Question, QuestionInterface} from '../../../models/Question'
import { Quiz } from "../../../models/Quiz";

export class CategoryApiController extends Controller {

    constructor() {
        super()
        this.except('Auth', 'getAll')
    }

    async getAll(request : Request, response : Response) {
        const results = await Category.find({})
        response.json(results)
    }

    async getQuiz(request : Request, response : Response) {
        const category = await Category.findById(request.params.id)
        if (!category) return response.status(500).json({message : 'Category not found'})

        const quiz = new Quiz({
            title : 'Category wise quiz',
            category : category.name,
            difficulty : 'Medium',
            count : 10,
            user : request.auth?.id()
        })
        Question.findRandom({
            category : category.name
        }, "label category difficulty options._id options.value", {
            limit : 10
        }, async (err : Error, results : QuestionInterface[]|undefined) => {
            if (err) return response.status(500).json({message : err.message})
            if (results) {
                quiz.questions = results?.map((question : QuestionInterface) => question.id)
            }
            await quiz.save()
            response.status(201).json({
                ...quiz.toObject(),
                questions : results
            })
        })
    }
}