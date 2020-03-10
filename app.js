const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const userRouter = require('./routes/userRoutes');
const mealRouter = require('./routes/mealRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too money requests from this IP! Please try again later!'
});
app.use('/api', limiter);
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;