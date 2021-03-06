require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', reason => {
    console.error(reason.name, reason.message);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
    console.error(reason);
    server.close(() => {
        process.exit(1);
    });
});


mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB successfully!')
});

const server = app.listen(process.env.PORT);
