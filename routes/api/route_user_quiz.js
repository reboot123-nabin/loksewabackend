const router = require('express').Router()
const {exists} = require('../../app/Validations/exists')
const { body } = require("express-validator");
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/quizzes/incomplete', Kernel.map('ApiUserQuizController@incompleteQuiz'))

router.get('/quiz/:id/result-assessment', Kernel.map('ApiUserQuizController@resultAssessment'))

module.exports = router