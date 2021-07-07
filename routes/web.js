const router = require('express').Router()
const {Kernel} = require('../app/Http/Controllers/Kernel/Kernel')

router.get('/', Kernel.map('HomeController@index'))

router.get('/file/:filename', Kernel.map('HomeController@responseFile'))

module.exports = router