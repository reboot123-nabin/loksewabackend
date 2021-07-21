const { unique, exists } = require("../../app/Validations/exists");
const { body } = require("express-validator");
const router = require('express').Router()
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/categories', Kernel.map('CategoryApiController@getAll'))

module.exports = router