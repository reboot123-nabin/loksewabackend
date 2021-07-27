const router = require('express').Router()
const { Kernel } = require('../../app/Http/Controllers/Kernel/Kernel')

router.get('/notifications', Kernel.map('NotificationApiController@getAll'))

module.exports = router