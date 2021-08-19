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

router.post('/quiz/purchase/:id', [
    // body('title', 'Required').exists({ checkFalsy }),
    body('count', 'Required').isNumeric(),
    // body('category', 'Required').exists({ checkFalsy })
    //     .if(body('category').exists())
    //     .custom(async (v, { req }) => {
    //         const res = await exists('category', 'Category', 'name').run(req);
    //         return res.isEmpty()
    //     })
], Kernel.map('QuizApiController@purchaseQuiz'));

router.get('/quizzes', Kernel.map('QuizApiController@getAll'))

router.get('/daily-quizzes', Kernel.map('QuizApiController@getDailyQuizzes'))

router.get('/quiz/:id', Kernel.map('QuizApiController@findOne'))
router.get('/quiz/find/:id', Kernel.map('QuizApiController@findQuiz'))

// attempt quiz
router.post('/quiz/:quiz/question/:question', [
    body('answer', 'Required').exists({checkFalsy})
], Kernel.map('QuizApiController@attempt'))

router.delete('/quiz/:id', Kernel.map('QuizApiController@deleteQuiz'))

module.exports = router