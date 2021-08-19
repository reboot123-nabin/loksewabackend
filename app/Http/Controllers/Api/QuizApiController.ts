import { Request, Response } from "express";
import { Document } from "mongoose";
import { Attempt } from "../../../models/Attempt";
import { Options, Question, QuestionInterface } from '../../../models/Question';
import { Quiz, QuizInterface } from '../../../models/Quiz';
import { Controller } from "../Kernel/Controller";
import { notify } from '../../../Helpers/notificationHelper'
import { RewardPoint } from '../../../models/RewardPoint'

export class QuizApiController extends Controller {

	constructor() {
		super()

		this.middleware('Auth')
	}

	async createQuiz(request: Request, response: Response) {
		if (!this.validate(request, response)) return;

		Question.findRandom(
			{
				category: request.body.category,
				difficulty: request.body.difficulty,
			},
			"label category difficulty options._id options.value",
			{
				limit: request.body.count,
			},
			async (err: Error, results: Document[] | undefined) => {
				if (err) return response.status(500).json({ message: err.message });
				const quiz = new Quiz({
					title: request.body.title,
					difficulty: request.body.difficulty,
					category: request.body.category,
					points: 10,
					count: request.body.count,
					questions: results?.map((x) => x.id),
				});
				await quiz.save();
				//create user notification
				await notify({
					title: 'New quiz created',
					message: `A quiz named '${quiz.title}' is created.`,
					uri: '/quiz/' + quiz.id,
					user: request.auth?.id(),
				})
				response.status(201).json(quiz);
			}
		);
	}

	//User buys quiz with reward (quiz) points
	async purchaseQuiz(request: Request, response: Response) {


		if (!this.validate(request, response)) return;
		Question.findRandom(
			{
				
			},
			"label category difficulty options._id options.value",
			{
				limit: request.body.count,
			},
			async (err: Error, results: Document[] | undefined) => {
				if (err) return response.status(500).json({ message: err.message });
				const p_quiz = new Quiz({
					title: 'Purchased quiz with points',
					category: 'Purchase',
					points: 5,
					count: request.body.count,
					questions: results?.map((x) => x.id),
					user: request.auth?.id(),
				});
				await p_quiz.save();
				await Quiz.populate(p_quiz, {path : 'questions'})

				//deduct reward (quiz) points
				const rp = request.auth?.user().points
				const deductAmt = request.body.count * 3
				if (deductAmt <= rp) {
					const new_rp = rp - deductAmt
					if (request.auth?.user()) {
						request.auth.user().points = new_rp
						await request.auth.user().save()
					}

					//insert in reward points collection
					const point = new RewardPoint()
					point.point = -(request.body.count * 3)
					point.remarks = point.point + " points deducted for quiz purchase";
					point.user = request.auth?.id()
					await point.save()

					//create user notification
					await notify({
						title: 'Quiz purchased!',
						message: `Your quiz is purchased and ready to be played.`,
						uri: '/quiz/' + p_quiz.id,
						user: request.auth?.id(),
					})
					response.status(201).json({quiz : p_quiz, points : new_rp});
				} else return response.status(500).json({ message: "Not enough balance." })
			}
		);
	}

	//User buys quiz with reward (quiz) points
	async topupBalance(request: Request, response: Response) {

		if (!this.validate(request, response)) return;

		//deduct reward (quiz) points
		const rp = request.auth?.user().points
		const deductAmt = request.body.count * 3
		if (deductAmt <= rp) {
			const new_rp = rp - deductAmt
			if (request.auth?.user()) {
				request.auth.user().points = new_rp
				await request.auth.user().save()
			}

			//insert in reward points collection
			const point = new RewardPoint()
			point.point = -(request.body.count * 10)
			point.remarks = point.point + "points deducted for mobile topip,";
			point.user = request.auth?.id()
			await point.save()

			//create user notification
			await notify({
				title: 'Quiz purchased!',
				message: `Your quiz is purchased and ready to be played.`,
				uri: '/',
				user: request.auth?.id(),
			})
			response.status(201).json({ status: "ok" });
		} else return response.status(400).json({ message: "Not enough balance." })
	}

	async getAll(request: Request, response: Response) {
		const results = await Quiz.find({}).populate({
			path: 'attempts',
			match: {
				user: request.auth?.id()
			}
		});
		response.json(results.map((q: QuizInterface) => {
			const quiz: { [key: string]: any } = q.toObject()
			quiz.completed = quiz.attempts && quiz.attempts[0]?.completed
			return quiz
		}));
	}

	getDailyQuizzes(request: Request, response: Response) {
		Quiz.find({user : {$exists : false}}, null, {sort : {createdAt : -1}}, (err: any, results: QuizInterface[]) => {
			response.json({data : results});
		});
	}

	async findOne(request: Request, response: Response) {
		const quiz = await Quiz.findById(request.params.id).populate(
			"questions",
			"label category options.value options._id" + (request.auth?.user('userType') === 'admin' ? ' options.is_correct' : '')
		);
		if (!quiz) return response.status(404).json({ message: 'Quiz not found' })

		const attempt = await Attempt.findOne({
			quiz: quiz.id.toString(),
			user: request.auth?.id()
		})

		const answeredQuestions = attempt?.answers.map(ans => ans.question) || []
		const questions = quiz.questions.map((question: QuestionInterface) => {
			const q = question.toObject()
			q.alreadyAnswered = answeredQuestions.includes(question.id.toString())
			return q
		})
		// response.json(quiz);
		response.json({ ...quiz.toObject(), questions, answeredQuestions });
	}

	async findQuiz(request: Request, response: Response) {
		const quiz = await Quiz.findById(request.params.id).populate(
			"questions",
			"label category options.value options._id" + (request.auth?.user('userType') === 'admin' ? ' options.is_correct' : '')
		);
		if (!quiz) return response.status(404).json({message : 'Quiz not found'})

		const attempt = await Attempt.findOne({
			quiz : quiz.id.toString(),
			user : request.auth?.id()
		})
		
		const answeredQuestions = attempt?.answers.map(ans => ans.question) || []
		const questions = quiz.questions.map((question : QuestionInterface) => {
			const q = question.toObject()
			q.alreadyAnswered = answeredQuestions.includes(question.id.toString())
			return q
		})
		// response.json(quiz);
		response.json({quiz : {...quiz.toObject(), questions, answeredQuestions}});
	}

	async attempt(request: Request, response: Response) {
		if (!this.validate(request, response)) return;

		let attempt = await Attempt.findOne({
			quiz: request.params.quiz,
			user: request.auth?.id()
		}).populate('quiz');

		if (attempt !== null) {
			await Quiz.populate(attempt.quiz, {
				path: 'questions',
				model: Question
			})
		}

		if (attempt == null) {
			attempt = new Attempt({
				quiz: request.params.quiz,
				user: request.auth?.id()
			});
			await Attempt.populate(attempt, {
				path: 'quiz',
				populate: {
					path: 'questions'
				}
			})
		}

		// check for already answered
		const exists = attempt.answers.filter(function ({ question }) {
			return question == request.params.question
		});
		if (exists.length) {
			return response.json({ status: 'ok1', correct: exists[0].correct });
		}

		let correct = false;

		if (typeof attempt.quiz !== 'string') {
			// check questions exists
			const questionExists = attempt.quiz.questions.map((q: QuestionInterface) => q.id.toString()).includes(request.params.question)
			if (!questionExists) {
				return response.status(404).json({ message: 'Question does not exsists' })
			}
			// check for correct answer
			attempt.quiz.questions.filter((x: QuestionInterface) => x.id == request.params.question).map((question: QuestionInterface) => {
				question?.options?.map((option: Options) => {
					if (option.id === request.body.answer && option.is_correct) {
						correct = true
					}
					return option
				})
				return question
			})
		}

		if (correct) {
			const point = new RewardPoint()
			point.point = typeof attempt.quiz !== 'string' ? (attempt.quiz.points || 10) : 10
			point.remarks = point.point + " points for correct answer";
			point.user = request.auth?.id(),
				point.meta = {
					quiz: request.params.quiz,
					question: request.params.question,
					answer: request.body.answer
				}
			await point.save()

			const user = request.auth?.user()
			user.points = (user.points || 0) + point.point
			await user.save()
		}

		attempt.answers.push({
			question: request.params.question,
			answer: request.body.answer,
			correct
		})

		if (typeof attempt.quiz !== 'string') {
			attempt.completed = attempt.quiz.questions.length === attempt.answers.length;
		}

		attempt
			.save()
			.then(() => response.status(201).json({ status: "ok", correct }))
			.catch((err: Error) =>
				response.status(500).json({ message: err.message })
			);
	}

	/**
	 * delete quiz from db
	 * @param request
	 * @param response
	 */
	async deleteQuiz(request: Request, response: Response) {
		const result = await Quiz.findByIdAndDelete(request.params.id, { useFindAndModify: false })
		response.json({ status: 'ok', result })
	}
}
