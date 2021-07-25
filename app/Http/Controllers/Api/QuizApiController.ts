import { Request, Response } from "express";
import { Document } from "mongoose";
import { Attempt } from "../../../models/Attempt";
import { Question } from "../../../models/Question";
import { Quiz } from "../../../models/Quiz";
import { Controller } from "../Kernel/Controller";

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
					count: request.body.count,
					questions: results?.map((x) => x.id),
				});
				await quiz.save();
				response.status(201).json(quiz);
			}
		);
	}

	getAll(request: Request, response: Response) {
		Quiz.find({}, (err: Error, results: Document[] | undefined) => {
			response.json(results);
		});
	}

	async findOne(request: Request, response: Response) {
		const quiz = await Quiz.findById(request.params.id).populate(
			"questions",
			"label category options.value options._id" + (request.auth?.user('userType') === 'admin' ? ' options.is_correct' : '')
		);
		response.json(quiz);
	}

	async attempt(request: Request, response: Response) {
		if (!this.validate(request, response)) return;

		let attempt = await Attempt.findOne({
			quiz : request.params.quiz,
			user : request.auth?.id()
		}).populate('quiz');

		if(attempt !== null) {
			await Quiz.populate(attempt.quiz, {
				path : 'questions',
				model : Question
			})
		}

		if(attempt == null) {
			attempt = new Attempt({
				quiz: request.params.quiz,
				user : request.auth?.id()
			});
			await Attempt.populate(attempt, {
				path : 'quiz',
				populate : {
					path : 'questions'
				}
			})
		}

		let correct = false;

		attempt.quiz.questions.filter((x : Document) => x.id == request.params.question).map((question : Document) => {
			question.options.map((option : Document) => {
				if(option.id === request.body.answer && option.is_correct) {
					correct = true
				}
				return option
			})
			return question
		})
				
		attempt.answers.push({
			question : request.params.question,
			answer : request.body.answer,
			correct
		})

		attempt
			.save()
			.then(() => response.status(201).json({ status: "ok", correct }))
			.catch((err: Error) =>
				response.status(500).json({ message: err.message })
			);
	}
}
