const router = require('express').Router()
const {body} = require("express-validator")
const upload = require('../../app/Http/Middlewares/Multer')
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')
const {AuthMiddleware} = require("../../app/Http/Middlewares/AuthMiddleware")

// my profile info
router.get('/user/profile', Kernel.map('UserApiController@profile'))

// update my profile picture
router.post('/user/profile/picture',
    AuthMiddleware.getInstance().use(), upload.single('file'),
    Kernel.map('UserApiController@profilePicture')
)

// update my profile info
router.post('/user/profile/update', [
    body('first_name', 'Required').exists({checkFalsy : true}),
    body('last_name', 'Required').exists({checkFalsy : true}),
    body('gender', 'Invalid value for gender. Valid values : ' + ['Male', 'Female', 'Other'].toString())
        .if(body('gender').exists({checkFalsy : true}))
        .isIn(['Male', 'Female', 'Other']),
    body('title', 'Invalid value for title. Valid values : ' + ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Er'].toString())
        .if(body('title').exists({checkFalsy : true}))
        .isIn(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Er']),
], Kernel.map('UserApiController@updateProfile'))

// update my login credential
router.post('/user/profile/credential', [
    body('email', 'Provide valid email address').normalizeEmail().isEmail(),
    body('old_password', 'Required').exists({checkFalsy : true}),
    body('new_password', 'Password must contain at least 6 characters').isLength({min : 6}),
], Kernel.map('UserApiController@profileCredential'))

// user mobile topup

router.get('/users/all', Kernel.map('UserApiController@getAllUsers'))

module.exports = router