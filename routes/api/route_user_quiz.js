const router = require('express').Router()
const { exists } = require('../../app/Validations/exists')
const { body } = require("express-validator");
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/quizzes/incomplete', Kernel.map('ApiUserQuizController@incompleteQuiz'))

router.get('/quiz/:id/result-assessment', Kernel.map('ApiUserQuizController@resultAssessment'))

router.get('/list/leaderboard', Kernel.map('ApiUserQuizController@leaderboard'))

router.post('/top-up/request', [
    body('rupee', 'Valid amount required').exists({ checkFalsy: true }).isNumeric()
        .custom((v, { req }) => {
            return !isNaN(v) && v > 0
        })
], Kernel.map('ApiUserQuizController@topupRequest'))

//route for admin dashboard, admin can see all users' requests
router.get('/list/topup', Kernel.map('ApiUserQuizController@getAllRequests'))

//route for user dasboard, user can only see their requests
router.get('/list/my-topup', Kernel.map('ApiUserQuizController@getMyRequests'))

//route for status change, admin sends status 'completed' and user sends 'cancelled'
router.post('/update/topup-status/:id', [
    body('status','Incorrect value for status was sent').exists({checkFalsy:true}).isIn(['cancelled','complete'])
], Kernel.map('ApiUserQuizController@updateRequest'))

module.exports = router