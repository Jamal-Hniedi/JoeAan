const factory = require('./handlerFactory');
const Meal = require('../models/mealModel');


exports.populateReviews = (req, res, next) => {
    req.populateOptions = {path: 'reviews'};
    next();
};

exports.getAllMeals = factory.getAll(Meal);
exports.getMeal = factory.getOneById(Meal);
exports.createMeal = factory.createOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.deleteMeal = factory.deleteOne(Meal);