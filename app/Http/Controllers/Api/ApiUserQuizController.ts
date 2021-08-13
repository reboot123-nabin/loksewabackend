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

    async resultAssessment(request : Request, response : Response)
    {
        const attempt = await Attempt.findOne({
            quiz : request.params.id,
            user : request.auth?.id()
        }).populate({
            path : 'quiz',
            populate : {
                path : 'questions'
            }
        })

        if(!attempt) return response.status(404).json({message : 'Quiz not found'})

        return response.json({
            data : attempt
        })
    }
}