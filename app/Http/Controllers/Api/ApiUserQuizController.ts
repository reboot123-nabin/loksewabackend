import {Controller} from '../Kernel/Controller'
import {Request, Response} from 'express'
import {Attempt} from '../../../models/Attempt'
import mongoose from 'mongoose'

export class ApiUserQuizController extends Controller
{
    constructor()
    {
        super()
        this.middleware('Auth')
    }

    async incompleteQuiz(request : Request, response : Response)
    {
        const incomplete = await Attempt.find({
            completed : false
        }, null, {})
            .populate('quiz')

        response.json({
            data : incomplete
        })
    }
}