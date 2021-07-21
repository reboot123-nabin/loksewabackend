const router = require('express').Router()
const {exists} = require('../../app/Validations/exists')
const { body } = require("express-validator");
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

const checkFalsy = true;

router.post('/quiz', [
    body('title', 'Required').exists({ checkFalsy }),
    body('difficulty', 'Required').isIn(['Easy', 'Medium', 'Hard']),
    body('count', 'Required').isNumeric(),
    body('category', 'Required').exists({ checkFalsy })
        .if(body('category').exists())
        .custom(async (v, { req }) => {
            const res = await exists('category', 'Category', 'name').run(req);
            return res.isEmpty()
        })
], Kernel.map('QuizApiController@createQuiz'));

router.get('/quizzes', Kernel.map('QuizApiController@getAll'))

router.get('/quiz/:id', Kernel.map('QuizApiController@findOne'))

router.post('/quiz/attempt', [
    body('quiz', 'Required').exists({checkFalsy}),
    body('answers.*.question', 'Required').exists({ checkFalsy }),
    body('answers.*.answer', 'Required').exists({ checkNull: true }),
    body('answers', 'Required').exists({ checkFalsy }).isArray().withMessage('Answers must be an array')
], Kernel.map('QuizApiController@attempt'))

module.exports = router