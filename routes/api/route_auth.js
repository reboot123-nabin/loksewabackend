const {unique, exists} = require("../../app/Validations/exists");
const {body} = require("express-validator");
const router = require('express').Router()
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')

router.post('/register', [
    body('first_name', 'First name field is required').exists({checkFalsy: true}),
    body('last_name', 'Last name field is required').exists({checkFalsy: true}),
    body('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(body('email').isEmail())
        .custom(async (v, {req}) => {
            const res = await unique('email', 'User', 'email').run(req)
            return res.isEmpty()
        }),
    body('password').isLength({min: 6}).withMessage('Password must contain at least 6 characters'),
], Kernel.map('LoginApiController@register'))

router.post('/login', [
    body('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(body('email').isEmail())
        .custom(async (v, {req}) => {
            const res = await exists('email', 'User', 'email').run(req)
            return res.isEmpty()
        }),
    body('password').exists({checkFalsy : true}).withMessage('Password is required'),
], Kernel.map('LoginApiController@login'));

module.exports = router