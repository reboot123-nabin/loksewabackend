const router = require('express').Router()
const {exists} = require('../../app/Validations/exists')
const { body } = require("express-validator");
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/quizzes/incomplete', Kernel.map('ApiUserQuizController@incompleteQuiz'))

router.get('/quiz/:id/result-assessment', Kernel.map('ApiUserQuizController@resultAssessment'))

router.get('/list/leaderboard', Kernel.map('ApiUserQuizController@leaderboard'))

router.post('/top-up/request', [
    body('rupee', 'Valid amount required').exists({checkFalsy : true}).isNumeric()
    .custom((v, {req}) => {
        return !isNaN(v) && v > 0
    })
], Kernel.map('ApiUserQuizController@topupRequest'))

module.exports = router