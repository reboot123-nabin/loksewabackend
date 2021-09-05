import { Controller } from '../Kernel/Controller'
import { Request, Response } from 'express'
import { Attempt } from '../../../models/Attempt'
import mongoose from 'mongoose'
import { RewardPoint } from '../../../models/RewardPoint'
import { TopUp } from '../../../models/TopUp'
import { notify } from '../../../Helpers/notificationHelper'
import { User } from '../../../models/User'

var sortJsonAray = require('sort-json-array');

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
            data: attempt,
            points: request.auth?.user('points')
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
                $sort: {
                    points: -1
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


    async topupRequest(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        const user = request.auth?.user(),
            rupee = request.body.rupee,
            rp = user?.points || 0;

        if (!user) return response.status(401).json({ message: 'Unauthorized request' })

        if (rupee * 10 > rp) return response.status(400).json({ message: 'Insufficient reward points' })

        const topUp = new TopUp({
            user: user._id,
            point: rupee * 10,
            amount: Number(rupee)
        })

        await topUp.save()

        user.points = rp - rupee * 10
        await user.save()

        const deductRp = new RewardPoint({
            user: user._id,
            point: -(rupee * 10),
            remarks: 'Deducted for top up request',
            meta: {
                amount: rupee
            }
        })

        //create user notification
        await notify({
            title: 'Quiz purchased!',
            message: `Your quiz is purchased and ready to be played.`,
            uri: '',
            user: request.auth?.id(),
        })


        await deductRp.save()

        response.status(201).json({ status: 'ok', points: user.points })
    }

    // all requests seen by admin
    async getAllRequests(request: Request, response: Response) {
        const topupRequests = await TopUp.find({}).populate('user')
        const quiz_played = await Attempt.countDocuments({
            completed: true,
        });
        const agg = await TopUp.aggregate([
            {
                $group : {
                    _id : {status : '$status'},
                    amount : {$sum : '$amount'}
                }
            }
        ])
        let topupRequest = 0;
        for(const topup of agg) {
            if(topup._id.status !== 'complete') continue;
            topupRequest = topup.amount;
        }
        const reward_users = await User.find({
            userType: 'user',
        }, null, { limit: 10, sort : {points : -1} });
        response.json({ data: sortJsonAray(topupRequests, 'created_at', 'des'), quiz_played, topupRequest,reward_users })
    }

    // user specific requests seen by users
    async getMyRequests(request: Request, response: Response) {
        const myRequests = await TopUp.find({ user: request.auth?.user()._id }).populate('user')
        response.json({ data: sortJsonAray(myRequests, 'created_at', 'des') })
    }


    async updateRequest(request: Request, response: Response) {
        if (!this.validate(request, response)) return;

        TopUp.findByIdAndUpdate(request.params.id, {
            status: request.body.status
        }, {
            useFindAndModify: false
        }).then((result: any) => response.json({ status: 'ok', data: result }))
            .catch((err: Error) => response.status(500).json({ message: err.message }))
    }
}