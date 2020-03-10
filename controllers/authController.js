const {promisify} = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;
    else return next(new AppError('Please log in to get access!', 401));
    const decoded = await decodeJWT(token);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('The user belonging to this token doesn\'t exist any more!', 401));
    if (user.passwordChangedAfter(decoded.iat))
        return next(new AppError('Password has been changed recently! Please log in again!', 401));
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError('You don\'t have permission to perform this action!', 403));
        next();
    };
};

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password)
        return next(new AppError('Please provide email and password!', 400));
    const user = await User.findOne({email}).select('+password');
    if (!user || !await user.isPasswordCorrect(password, user.password))
        return next(new AppError('Incorrect email or password!', 400));
    createSendToken(user, req, res);
});
exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'Logged out', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200)
        .json({
            status: 'success'
        })
});

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(user, req, res);
});

const decodeJWT = token => {
    return promisify(jwt.verify)(token, process.env.JWT_SK);
};

const createJWT = id => {
    return jwt.sign({id}, process.env.JWT_SK, {expiresIn: process.env.JWT_COOKIE_EXPIRES_IN});
};

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
};
const createSendToken = (user, req, res) => {
    const token = createJWT(user._id);
    cookieOptions.secure = req.secure || req.get('x-forwarded-proto') === 'https';
    res.cookie('jwt', token, cookieOptions);
    res.status(200)
        .json({
            status: 'success',
            data: {
                user
            }
        });
};