import { Controller } from '../Kernel/Controller'
import { Request, Response } from 'express'
import { Attempt } from '../../../models/Attempt'
import mongoose from 'mongoose'
import { RewardPoint } from '../../../models/RewardPoint'

export class ApiUserQuizController extends Controller {
    constructor() {
        super()
        this.middleware('Auth')
    }

    async incompleteQuiz(request: Request, response: Response) {
        const incomplete = await Attempt.find({
            completed: false
        }, null, {})
            .populate('quiz')

        response.json({
            data: incomplete
        })
    }

    async resultAssessment(request: Request, response: Response) {
        const attempt = await Attempt.findOne({
            quiz: request.params.id,
            user: request.auth?.id()
        }).populate({
            path: 'quiz',
            populate: {
                path: 'questions'
            }
        })

        if (!attempt) return response.status(404).json({ message: 'Quiz not found' })

        return response.json({
            data: attempt
        })
    }

    async leaderboard(request: Request, response: Response) {
        const type = request.query.type || 'daily'
        const points = await RewardPoint.aggregate([
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
                $lookup:
                {
                    from: "users",
                    localField: "_id.user",
                    foreignField: "_id",
                    as: "users"
                }
            }, 
            {
                $sort : {
                    points : -1
                }
            }
        ])
        response.json({
            data: points.map(rp => {
                const c = rp.users[0]
                c.points = rp.points
                return c
            })
        })
    }
}