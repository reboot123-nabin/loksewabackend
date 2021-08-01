const { body } = require("express-validator");
const router = require('express').Router()
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

const checkFalsy = true;
router.post('/question', [
    body('label', 'Required').exists({ checkFalsy }),
    body('category', 'Required').exists({ checkFalsy }),
    body('difficulty', 'Required').exists({ checkFalsy }).isIn(['Easy', 'Medium', 'Hard']),
    body('options.*.value', 'Required').exists({ checkFalsy }),
    body('options.*.is_correct', 'Required').exists({ checkNull: true }),
    body('options', 'Required').exists({ checkFalsy })
        .custom(v => Array.isArray(v)).withMessage('Options must be an array')
        .custom(v => Array.isArray(v) && v.length === 4).withMessage('A question must have 4 options')
        .custom(v => Array.isArray(v) && v.filter(x => x.is_correct).length === 1).withMessage('Options must have 1 correct answer among all')
], Kernel.map('QuestionApiController@saveQuestion'));

router.get('/questions', Kernel.map('QuestionApiController@getAll'))

router.get('/question/:id', Kernel.map('QuestionApiController@findOne'))

router.post('/question/:id/update', [
    body('label', 'Required').exists({ checkFalsy }),
    body('category', 'Required').exists({ checkFalsy }),
    body('difficulty', 'Required').exists({ checkFalsy }).isIn(['Easy', 'Medium', 'Hard']),
    body('options.*.value', 'Required').exists({ checkFalsy }),
    body('options.*.is_correct', 'Required').exists({ checkNull: true }),
    body('options', 'Required').exists({ checkFalsy })
        .custom(v => Array.isArray(v)).withMessage('Options must be an array')
        .custom(v => Array.isArray(v) && v.length === 4).withMessage('A question must have 4 options')
        .custom(v => Array.isArray(v) && v.filter(x => x.is_correct).length === 1).withMessage('Options must have 1 correct answer among all')
], Kernel.map('QuestionApiController@updateQuestion'))

router.delete('/question/:id', Kernel.map('QuestionApiController@deleteQuestion'))

module.exports = router