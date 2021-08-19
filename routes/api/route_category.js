const { unique, exists } = require("../../app/Validations/exists");
const { body } = require("express-validator");
const router = require('express').Router()
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/categories', Kernel.map('CategoryApiController@getAll'))

router.get('/category/all', Kernel.map('CategoryApiController@getAllCategory'))

router.get('/category/:id', Kernel.map('CategoryApiController@getQuiz'))

module.exports = router