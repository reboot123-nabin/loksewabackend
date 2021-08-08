const router = require('express').Router()
const { body } = require('express-validator')
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.post('/password/reset', [
    body('phone', 'Required').exists({checkFalsy : true}).isMobilePhone('ne-NP')
], Kernel.map('PasswordResetApiController@reset'))

router.post('/change/password', [
    body('phone', 'Required').exists({checkFalsy : true}).isMobilePhone('ne-NP'),
    body('password', 'Required').isLength({min : 6})
], Kernel.map('PasswordResetApiController@changePassword'))

module.exports = router