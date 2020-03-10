const mongoose = require('mongoose');

const schema = new mongoose.Schema({
        category: {
            type: String,
            required: [true, 'Meal must belong to a category!'],
        },
        name: {
            type: String,
            required: [true, 'Meal must have a name!'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Meal must have a price!']
        },
        imageCover: {
            type: String,
            required: [true, 'Meal must have a cover!']
        },
        images: [String],
        description: {
            type: String,
            required: [true, 'Meal must have a description!'],
            trim: true
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [0, 'Rating must be above 0'],
            max: [5, 'Rating must be below 5'],
            set: value => Math.round(value * 10) / 10
        },
        ratingsCount: {
            type: Number,
            default: 0,
            min: [0, 'Rating count must be above 0']
        },
        sideItems: [String],
        available: {
            type: Boolean,
            default: true
        }
    }
);

schema.pre(/\b(find|findOne)\b/, function (next) {
    this.find({available: true});
    next();
});

const Meal = mongoose.model('Meal', schema);
module.exports = Meal;