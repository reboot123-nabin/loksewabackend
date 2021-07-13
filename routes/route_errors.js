const router = require('express').Router()

router.get('/500', function (request, response) {
    response.status(500).render('errors/500')
})

router.get('/404', function (request, response) {
    response.status(404).render('errors/404')
})

router.all('/api/*', function (request, response) {
    return response.status(404).json({
        message : 'Page not found'
    })
    // response.status(404).render('errors/404')
})

module.exports = router