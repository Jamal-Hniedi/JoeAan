const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');
const authController = require('../controllers/authController');

exports.grantPermission = (req, res, next) => {
    if (req.filter) return next();
    authController.restrictTo('admin');
    next();
};

exports.setIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user;
    if (!req.body.meal) req.body.meal = req.params.mealId;
    next();
};


exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOneById(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);