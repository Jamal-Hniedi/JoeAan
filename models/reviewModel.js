const mongoose = require('mongoose');
const Meal = require('./mealModel');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user!']
    },
    meal: {
        type: mongoose.Schema.ObjectId,
        ref: 'Meal',
        required: [true, 'Review must belong to a meal!']
    },
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        required: [true, 'Review must have a rating!'],
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

/**
 * Ensures no more than 1 review from one user for each meal.
 */
schema.index({user: 1, meal: 1}, {unique: true});


schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'username photo'
    });
    next();
});

/**
 * Calculate and update ratings avg and ratings quantity>
 */
schema.statics.calcRatings = async function (mealId) {
    const stats = await this.aggregate([
        {
            $match: {meal: mealId}
        },
        {
            $group: {
                _id: '$meal',
                ratingsAverage: {$avg: '$rating'},
                ratingsQuantity: {$sum: 1}
            }
        }
    ]);
    if (stats.length > 0)
        await Meal.findByIdAndUpdate(mealId, {
            ratingsAverage: stats[0].ratingsAverage,
            ratingsQuantity: stats[0].ratingsQuantity
        });
    else await Meal.findByIdAndUpdate(mealId, {
        ratingsAverage: 0,
        ratingsQuantity: 0
    });
};

/**
 * Update ratings-related stuff in meal after every new review
 */
schema.post('save', async function () {
    await this.constructor.calcRatings(this.meal);
});

/**
 * Update ratings-related stuff in meal after every updating/deleting a review
 */
schema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne();
    next();
});
schema.post(/^findOneAnd/, async function () {
    await this.review.constructor.calcRatings(this.review.meal);
});


const Review = mongoose.model('Review', schema);
module.exports = Review;