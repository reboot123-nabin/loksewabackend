import { Request, Response } from "express";
import { Document } from "mongoose";
import { Question } from "../../../models/Question";
import { Controller } from "../Kernel/Controller"

export class QuestionApiController extends Controller {

    constructor() {
        super()
        this.middleware('Auth')
    }

    saveQuestion(request : Request, response : Response) {
        if(!this.validate(request, response)) return;

        const question = new Question({
            label : request.body.label,
            category : request.body.category,
            options : request.body.options
        })
        question.save().then((q : Document) => response.status(201).json(q))
        .catch((err : Error) => response.status(500).json({message : err.message}))
    }

}