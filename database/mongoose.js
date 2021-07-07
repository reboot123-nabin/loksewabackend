const mongoose = require('mongoose')

mongoose.connect(process.env.DB_PATH, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useCreateIndex : true
}).then(() => {
    console.log('mongo db connection started');
})